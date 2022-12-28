import { BaseChannel } from 'lisk-framework';
import { Collection } from '../../../../../types/core/chain/collection';
import collectionChainToUI from './collectionChainToUI';
import { invokeGetCollection, invokeGetLiked } from '../invoker/redeemable_nft_module';
import idBufferToActivityCollection from './idBufferToActivityCollection';
import { idBufferToMomentAt } from './idBufferToMomentAt';
import { minimizeMoment } from './minimizeToBase';

export default async function idBufferToCollection(
  channel: BaseChannel,
  id: Buffer,
  withMoment = true,
  viewer?: string,
): Promise<Collection | undefined> {
  const collection = await invokeGetCollection(channel, id.toString('hex'));
  if (!collection) return undefined;
  const activity = await idBufferToActivityCollection(channel, id, viewer);
  const restCollection = await collectionChainToUI(channel, collection, true, viewer);
  const liked = viewer ? (await invokeGetLiked(channel, id.toString('hex'), viewer)) === 1 : false;
  const moment = withMoment
    ? (await idBufferToMomentAt(channel, id, viewer)).map(momentItem => minimizeMoment(momentItem))
    : [];
  return {
    ...collection,
    ...restCollection,
    activity,
    moment,
    liked,
  };
}
