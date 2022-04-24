import { BaseChannel } from 'lisk-framework';
import { Collection } from '../../../../types/core/chain/collection';
import collectionChainToUI from './collectionChainToUI';
import { invokeGetCollection } from './hook/redeemable_nft_module';
import idBufferToActivityCollection from './idBufferToActivityCollection';

export default async function idBufferToCollection(
  channel: BaseChannel,
  id: Buffer,
): Promise<Collection | undefined> {
  const collection = await invokeGetCollection(channel, id.toString('hex'));
  if (!collection) return undefined;
  const activity = await idBufferToActivityCollection(channel, id);
  const restCollection = await collectionChainToUI(channel, collection);
  return {
    ...collection,
    ...restCollection,
    activity,
  };
}
