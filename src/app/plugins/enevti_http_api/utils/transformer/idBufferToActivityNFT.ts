import { BaseChannel } from 'lisk-framework';
import { NFTActivity } from 'enevti-types/chain/nft/NFTActivity';
import addressBufferToPersona from './addressBufferToPersona';
import { invokeGetActivityNFT } from '../invoker/redeemable_nft_module';
import chainDateToUI from './chainDateToUI';

export default async function idBufferToActivityNFT(channel: BaseChannel, id: Buffer) {
  const activityChain = await invokeGetActivityNFT(channel, id.toString('hex'));
  const activity: NFTActivity[] = await Promise.all(
    activityChain.items.map(async act => {
      const transaction = act.transaction.toString('hex');
      const to = await addressBufferToPersona(channel, act.to);
      const value = {
        amount: act.value.amount.toString(),
        currency: act.value.currency,
      };
      return { ...act, date: chainDateToUI(act.date), transaction, to, value };
    }),
  );
  return activity;
}
