import { BaseChannel } from 'lisk-framework';
import { MomentActivity } from '../../../../../types/core/chain/moment';
import { invokeGetActivityMoment } from '../invoker/redeemable_nft_module';
import addressBufferToPersona from './addressBufferToPersona';
import chainDateToUI from './chainDateToUI';

export default async function idBufferToActivityMoment(channel: BaseChannel, id: Buffer) {
  const activityChain = await invokeGetActivityMoment(channel, id.toString('hex'));
  const activity: MomentActivity[] = await Promise.all(
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
