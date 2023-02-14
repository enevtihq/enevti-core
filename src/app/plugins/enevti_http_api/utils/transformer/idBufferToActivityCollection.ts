import { BaseChannel } from 'lisk-framework';
import { CollectionActivity } from 'enevti-types/chain/collection';
import { NFT } from 'enevti-types/chain/nft';
import addressBufferToPersona from './addressBufferToPersona';
import { invokeGetActivityCollection } from '../invoker/redeemable_nft_module';
import idBufferToNFT from './idBufferToNFT';
import chainDateToUI from './chainDateToUI';

export default async function idBufferToActivityCollection(
  channel: BaseChannel,
  id: Buffer,
  viewer?: string,
) {
  const activityChain = await invokeGetActivityCollection(channel, id.toString('hex'));
  const activity: CollectionActivity[] = await Promise.all(
    activityChain.items.map(async act => {
      const transaction = act.transaction.toString('hex');
      const to = await addressBufferToPersona(channel, act.to);
      const nfts = await Promise.all(
        act.nfts.map(
          async (item): Promise<NFT> => {
            const nft = await idBufferToNFT(channel, item, false, viewer);
            if (!nft)
              throw new Error('NFT not found while processing idBufferToActivityCollection');
            return nft;
          },
        ),
      );
      const value = {
        amount: act.value.amount.toString(),
        currency: act.value.currency,
      };
      return { ...act, date: chainDateToUI(act.date), transaction, to, value, nfts };
    }),
  );
  return activity;
}
