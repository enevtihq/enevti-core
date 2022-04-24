import { BaseChannel } from 'lisk-framework';
import { CollectionActivity } from '../../../../types/core/chain/collection';
import addressBufferToPersona from './addressBufferToPersona';
import { invokeGetActivityCollection } from './hook/redeemable_nft_module';
import idBufferToNFT from './idBufferToNFT';

export default async function idBufferToActivityCollection(channel: BaseChannel, id: Buffer) {
  const activityChain = await invokeGetActivityCollection(channel, id.toString('hex'));
  const activity: CollectionActivity[] = await Promise.all(
    activityChain.items.map(async act => {
      const transaction = act.transaction.toString('hex');
      const to = await addressBufferToPersona(channel, act.to);
      const nft = await idBufferToNFT(channel, act.nft);
      if (!nft) throw new Error('NFT not found while processing activity');
      const value = {
        amount: act.value.amount.toString(),
        currency: act.value.currency,
      };
      return { ...act, transaction, to, value, nft };
    }),
  );
  return activity;
}
