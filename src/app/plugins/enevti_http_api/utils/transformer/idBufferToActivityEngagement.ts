import { BaseChannel } from 'lisk-framework';
import { invokeGetActivityEngagement } from '../invoker/redeemable_nft_module';
import chainDateToUI from './chainDateToUI';
import { EngagementActivity } from 'enevti-types/account/profile';
import idBufferToNFT from './idBufferToNFT';
import idBufferToCollection from './idBufferToCollection';

export default async function idBufferToActivityEngagement(
  channel: BaseChannel,
  address: Buffer,
  viewer?: string,
) {
  const activityChain = await invokeGetActivityEngagement(channel, address.toString('hex'));
  const activity: EngagementActivity[] = await Promise.all(
    activityChain.items.map(async act => {
      const transaction = act.transaction.toString('hex');

      let target: Record<string, unknown> = {};
      switch (act.name) {
        case 'likeNft':
        case 'commentNft':
          target = ((await idBufferToNFT(channel, act.target, false, viewer)) as unknown) as Record<
            string,
            unknown
          >;
          break;
        case 'likeCollection':
        case 'commentCollection':
          target = ((await idBufferToCollection(
            channel,
            act.target,
            false,
            viewer,
          )) as unknown) as Record<string, unknown>;
          break;
        default:
          break;
      }

      return { ...act, date: chainDateToUI(act.date), transaction, target };
    }),
  );
  return activity;
}
