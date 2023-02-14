import { AfterBlockApplyContext } from 'lisk-framework';
import { BaseModuleChannel } from 'lisk-framework/dist-node/modules';
import { cryptography } from 'lisk-sdk';
import * as seedrandom from 'seedrandom';
import { SocialRaffleGenesisConfig } from 'enevti-types/chain/config/SocialRaffleGenesisConfig';
import { getCollectionById, isMintingAvailable, setCollectionById } from '../../utils/collection';
import {
  getSocialRaffleState,
  addSocialRafflePool,
  isCollectionEligibleForRaffle,
  isProfileEligibleForRaffle,
  setSocialRaffleRecord,
  getSocialRaffleRecord,
  resetSocialRaffleStateRegistrar,
} from '../../utils/social_raffle';
import { debitBlockReward } from '../../utils/block_rewards';
import { RedeemableNFTAccountProps } from 'enevti-types/account/profile';
import { addInObject, asyncForEach, getBlockTimestamp } from '../../utils/transaction';
import { SocialRaffleRecord } from 'enevti-types/chain/socialRaffle';
import { MintNFTUtilsFunctionProps } from '../../utils/mint';

export const socialRaffleMonitor = async (
  input: AfterBlockApplyContext,
  config: SocialRaffleGenesisConfig,
  channel: BaseModuleChannel,
  collectionWithNewActivity: Set<string>,
  accountWithNewActivity: Set<string>,
  totalNftMintedInCollection: { [collection: string]: number },
  pendingNFTBuffer: Set<string>,
  accountWithNewPending: Set<string>,
) => {
  const rafflePoolAmount =
    (input.block.header.reward * BigInt(config.socialRaffle.rewardsCutPercentage)) / BigInt(100);
  await debitBlockReward(input, rafflePoolAmount);
  await addSocialRafflePool(input.stateStore, rafflePoolAmount);

  const socialRaffleRecordPrevBlock = await getSocialRaffleRecord(
    input.stateStore,
    input.block.header.height - 1,
  );
  if (socialRaffleRecordPrevBlock) {
    await asyncForEach(socialRaffleRecordPrevBlock.items, async items => {
      const collection = await getCollectionById(input.stateStore, items.id.toString('hex'));
      if (!collection) throw new Error('Collection not found while monintorng social raffle');

      collectionWithNewActivity.add(items.id.toString('hex'));
      accountWithNewActivity.add(items.winner.toString('hex'));
      addInObject(totalNftMintedInCollection, items.id, items.raffled.length);

      const creatorAccount = await input.stateStore.account.get<RedeemableNFTAccountProps>(
        collection.creator,
      );
      if (creatorAccount.redeemableNft.pending.length > 0) {
        creatorAccount.redeemableNft.pending.forEach(nft =>
          pendingNFTBuffer.add(nft.toString('hex')),
        );
        accountWithNewPending.add(collection.creator.toString('hex'));
      }
    });
  }

  if (input.block.header.height % config.socialRaffle.blockInterval === 0) {
    const pnrg = seedrandom(input.stateStore.chain.lastBlockHeaders[0].id.toString('hex'));
    const collectionWithNewRaffled: { [address: string]: number } = {};
    const socialRaffleRecord: SocialRaffleRecord = { items: [] };

    const socialRaffleState = await getSocialRaffleState(input.stateStore);
    let socialRafflePool = socialRaffleState.pool;

    socialRaffleState.registrar.sort((a, b) => Number(b.weight - a.weight));
    for (const registrar of socialRaffleState.registrar) {
      if (socialRafflePool <= BigInt(0)) break;

      const timestamp = getBlockTimestamp(input.stateStore);
      const collection = await getCollectionById(input.stateStore, registrar.id.toString('hex'));
      if (!collection) throw new Error('Collection not found while monintorng social raffle');

      const creatorAccount = await input.stateStore.account.get<RedeemableNFTAccountProps>(
        collection.creator,
      );

      if (
        isMintingAvailable(collection, timestamp) &&
        collection.minting.available.length >= collection.packSize &&
        isCollectionEligibleForRaffle(collection, config.socialRaffle) &&
        isProfileEligibleForRaffle(creatorAccount, config.socialRaffle) &&
        collection.minting.price.amount < socialRafflePool
      ) {
        const selectedCandidateIndex = Math.floor(pnrg() * registrar.candidate.length);

        const mintNFTProps: MintNFTUtilsFunctionProps = {
          id: collection.id.toString('hex'),
          quantity: 1,
          reducerHandler: input.reducerHandler,
          transactionId: cryptography.stringToBuffer(
            `block:${input.block.header.id.toString('hex')}`,
          ),
          senderPublicKey: registrar.candidate[selectedCandidateIndex],
          type: 'raffle',
        };

        const raffledNft: Buffer[] = await input.reducerHandler.invoke(
          'redeemableNft:mintNFT',
          mintNFTProps,
        );

        const newCollection = await getCollectionById(
          input.stateStore,
          registrar.id.toString('hex'),
        );
        if (!newCollection) throw new Error('Collection not found while monintorng social raffle');

        socialRafflePool -= newCollection.minting.price.amount;
        socialRaffleRecord.items.push({
          id: newCollection.id,
          winner: cryptography.getAddressFromPublicKey(registrar.candidate[selectedCandidateIndex]),
          raffled: raffledNft,
        });

        newCollection.raffled += 1;
        await setCollectionById(input.stateStore, newCollection.id.toString('hex'), newCollection);

        addInObject(collectionWithNewRaffled, newCollection.id, raffledNft.length);
        channel.publish('redeemableNft:wonRaffle', {
          collection: newCollection.id.toString('hex'),
          address: cryptography
            .getAddressFromPublicKey(registrar.candidate[selectedCandidateIndex])
            .toString('hex'),
          items: raffledNft.map(t => t.toString('hex')),
        });
      }
    }

    await setSocialRaffleRecord(input.stateStore, input.block.header.height, socialRaffleRecord);

    for (const collectionId of Object.keys(collectionWithNewRaffled)) {
      const collection = await getCollectionById(input.stateStore, collectionId);
      if (!collection) throw new Error('Collection not found while monintorng social raffle');
      channel.publish('redeemableNft:newRaffled', {
        address: collection.creator.toString('hex'),
        collection: collection.id.toString('hex'),
        total: collectionWithNewRaffled[collection.id.toString('hex')],
      });
    }

    await resetSocialRaffleStateRegistrar(input.stateStore);
  }
};
