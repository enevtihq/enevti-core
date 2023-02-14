import { AfterBlockApplyContext } from 'lisk-framework';
import { CollectionAsset } from 'enevti-types/chain/collection';
import {
  getAllCollection,
  getCollectionById,
  getAllUnavailableCollection,
  isMintingAvailable,
  setAllCollection,
  setAllUnavailableCollection,
} from '../../utils/collection';

export const collectionMintingAvailabilityMonitor = async (input: AfterBlockApplyContext) => {
  const allCollection = await getAllCollection(input.stateStore);
  const allCollectionAsset: CollectionAsset[] = await Promise.all(
    allCollection.items.map(async id => {
      const collection = await getCollectionById(input.stateStore, id.toString('hex'));
      if (!collection) throw new Error('undefined collection while iterating allCollection');
      return collection;
    }),
  );
  const allUnavailableCollection = await getAllUnavailableCollection(input.stateStore);
  allCollectionAsset.forEach(collection => {
    if (!isMintingAvailable(collection, input.block.header.timestamp)) {
      const index = allCollection.items.findIndex(t => Buffer.compare(t, collection.id) === 0);
      if (index === -1) throw new Error('findindex failed in afterblock apply');
      allCollection.items.splice(index, 1);
      allUnavailableCollection.items.unshift(collection.id);
    }
  });
  await setAllCollection(input.stateStore, allCollection);
  await setAllUnavailableCollection(input.stateStore, allUnavailableCollection);
};
