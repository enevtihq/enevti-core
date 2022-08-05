import { AfterBlockApplyContext } from 'lisk-framework';
import { BaseModuleChannel } from 'lisk-framework/dist-node/modules';
import { cryptography } from 'lisk-sdk';
import * as seedrandom from 'seedrandom';
import { SocialRaffleGenesisConfig } from '../../../../../types/core/chain/config/SocialRaffleGenesisConfig';
import { getCollectionById } from '../../utils/collection';
import {
  getSocialRaffleState,
  resetSocialRaffleState,
  addSocialRafflePool,
} from '../../utils/social_raffle';
import { debitBlockReward } from '../../utils/block_rewards';

export const socialRaffleMonitor = async (
  input: AfterBlockApplyContext,
  config: SocialRaffleGenesisConfig,
  channel: BaseModuleChannel,
) => {
  const rafflePoolAmount =
    (input.block.header.reward * BigInt(config.socialRaffle.rewardsCutPercentage)) / BigInt(100);
  await debitBlockReward(input, rafflePoolAmount);
  await addSocialRafflePool(input.stateStore, rafflePoolAmount);

  if (input.block.header.height % config.socialRaffle.blockInterval === 0) {
    const pnrg = seedrandom(input.stateStore.chain.lastBlockHeaders[0].id.toString('hex'));
    const socialRaffleState = await getSocialRaffleState(input.stateStore);
    let socialRafflePool = socialRaffleState.pool;

    socialRaffleState.registrar.sort((a, b) => Number(b.weight - a.weight));
    for (const registrar of socialRaffleState.registrar) {
      if (socialRafflePool <= BigInt(0)) break;

      const collection = await getCollectionById(input.stateStore, registrar.id.toString('hex'));
      if (!collection) throw new Error('Collection not found while monintorng social raffle');

      if (collection.minting.price.amount < socialRafflePool) {
        const selectedCandidateIndex = Math.floor(pnrg() * registrar.candidate.length);

        const raffledNft: Buffer[] = await input.reducerHandler.invoke('redeemableNft:mintNFT', {
          id: collection.id,
          quantity: 1,
          reducerHandler: input.reducerHandler,
          transactionId: `block:${input.block.header.id.toString('hex')}`,
          senderPublicKey: registrar.candidate[selectedCandidateIndex],
          type: 'raffle',
        });

        socialRafflePool -= collection.minting.price.amount;

        channel.publish('redeemableNft:newRaffled', {
          collection: collection.id.toString('hex'),
          address: cryptography
            .getAddressFromPublicKey(registrar.candidate[selectedCandidateIndex])
            .toString('hex'),
          items: raffledNft.map(t => t.toString('hex')),
        });
      }
    }

    await resetSocialRaffleState(input.stateStore);
  }
};
