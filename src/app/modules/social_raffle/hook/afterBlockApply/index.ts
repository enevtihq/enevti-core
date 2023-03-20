import { SocialRaffleConfig } from 'enevti-types/chain/social_raffle/config';
import * as seedrandom from 'seedrandom';
import { AfterBlockApplyContext } from 'lisk-framework';
import { BaseModuleChannel } from 'lisk-framework/dist-node/modules';
import { SocialRaffleBlockRecord } from 'enevti-types/chain/social_raffle';
import { CollectionAsset } from 'enevti-types/chain/collection';
import { AddCountParam } from 'enevti-types/param/count';
import { NewBlockRecordEvent } from 'enevti-types/param/social_raffle';
import { cryptography } from 'lisk-sdk';
import {
  SOCIAL_RAFFLE_PREFIX,
  ADDRESS_RECORD_PREFIX,
  COLLECTION_RECORD_PREFIX,
} from '../../constants/codec';
import { addSocialRafflePool } from '../../utils/add';
import { debitBlockReward } from '../../utils/reward';
import { getSocialRaffleState, resetSocialRaffleStateRegistrar } from '../../utils/state';
import { isCollectionEligibleForRaffle, isProfileEligibleForRaffle } from '../../utils/eligibility';
import { MintNFTUtilsFunctionProps } from '../../../redeemable_nft/utils/mint';
import { setSocialRaffleBlockRecord } from '../../utils/block';
import { encodeAddressRaffledRecord } from '../../utils/address';
import { encodeCollectionRaffledRecord } from '../../utils/collectionRecord';

export default async function socialRaffleAfterBlockApply(
  input: AfterBlockApplyContext,
  channel: BaseModuleChannel,
  config: SocialRaffleConfig,
) {
  const rafflePoolAmount =
    (input.block.header.reward * BigInt(config.socialRaffle.rewardsCutPercentage)) / BigInt(100);

  await debitBlockReward(input, rafflePoolAmount);
  await addSocialRafflePool(input.stateStore, rafflePoolAmount);

  if (input.block.header.height % config.socialRaffle.blockInterval === 0) {
    const pnrg = seedrandom(input.stateStore.chain.lastBlockHeaders[0].id.toString('hex'));
    const socialRaffleRecord: SocialRaffleBlockRecord = { items: [] };

    const socialRaffleState = await getSocialRaffleState(input.stateStore);
    let socialRafflePool = socialRaffleState.pool;

    socialRaffleState.registrar.sort((a, b) => Number(b.weight - a.weight));
    for (const registrar of socialRaffleState.registrar) {
      if (socialRafflePool <= BigInt(0)) break;

      // TODO: change to LIP-52 based collection retrival
      const collection = await input.reducerHandler.invoke<CollectionAsset | undefined>(
        'redeemableNft:getCollection',
        { id: registrar.id.toString('hex') },
      );
      if (!collection) throw new Error('Collection not found while monintorng social raffle');

      const profileEligible = await isProfileEligibleForRaffle(
        input.reducerHandler,
        collection.creator,
      );

      const collectionEligible = await isCollectionEligibleForRaffle(
        input.reducerHandler,
        registrar.id,
      );

      if (
        collectionEligible &&
        profileEligible &&
        collection.minting.price.amount < socialRafflePool
      ) {
        const selectedCandidateIndex = Math.floor(pnrg() * registrar.candidate.length);

        // TODO: later should change to LIP-52 based minting
        const raffledNft: Buffer[] = await input.reducerHandler.invoke('redeemableNft:mintNFT', {
          id: collection.id.toString('hex'),
          quantity: 1,
          reducerHandler: input.reducerHandler,
          transactionId: cryptography.stringToBuffer(
            `block:${input.block.header.id.toString('hex')}`,
          ),
          senderPublicKey: registrar.candidate[selectedCandidateIndex],
          type: 'raffle',
        } as MintNFTUtilsFunctionProps);

        socialRafflePool -= collection.minting.price.amount;
        socialRaffleRecord.items.push({
          id: collection.id,
          winner: cryptography.getAddressFromPublicKey(registrar.candidate[selectedCandidateIndex]),
          raffled: raffledNft,
        });

        await input.reducerHandler.invoke('count:addCount', {
          module: SOCIAL_RAFFLE_PREFIX,
          key: ADDRESS_RECORD_PREFIX,
          address: collection.creator,
          item: encodeAddressRaffledRecord({
            height: input.block.header.height,
            collection: collection.id,
          }),
        } as AddCountParam);

        await input.reducerHandler.invoke('count:addCount', {
          module: SOCIAL_RAFFLE_PREFIX,
          key: COLLECTION_RECORD_PREFIX,
          address: collection.id,
          item: encodeCollectionRaffledRecord({
            height: input.block.header.height,
          }),
        } as AddCountParam);
      }
    }

    await setSocialRaffleBlockRecord(
      input.stateStore,
      input.block.header.height,
      socialRaffleRecord,
    );

    channel.publish(`${SOCIAL_RAFFLE_PREFIX}:newBlockRecord`, {
      height: input.block.header.height,
    } as NewBlockRecordEvent);

    await resetSocialRaffleStateRegistrar(input.stateStore);
  }
}
