import { BaseChannel } from 'lisk-framework';
import { CollectionActivity } from '../../../../../types/core/chain/collection';
import { NFT } from '../../../../../types/core/chain/nft';
import addressBufferToPersona from './addressBufferToPersona';
import { invokeGetActivityCollection } from '../hook/redeemable_nft_module';
import idBufferToNFT from './idBufferToNFT';

export default async function idBufferToActivityCollection(channel: BaseChannel, id: Buffer) {
  const activityChain = await invokeGetActivityCollection(channel, id.toString('hex'));
  const activity: CollectionActivity[] = await Promise.all(
    activityChain.items.map(async act => {
      const transaction = act.transaction.toString('hex');
      const to = await addressBufferToPersona(channel, act.to);
      const nfts = await Promise.all(
        act.nfts.map(
          async (item): Promise<NFT> => {
            const nft = await idBufferToNFT(channel, item);
            if (!nft) throw new Error('NFT not found while processing minted');
            return nft;
          },
        ),
      );
      const value = {
        amount: act.value.amount.toString(),
        currency: act.value.currency,
      };
      return { ...act, transaction, to, value, nfts };
    }),
  );
  return activity;
}
