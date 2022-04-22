import { codec, StateStore } from 'lisk-sdk';
import { allCollectionSchema, collectionSchema } from '../schemas/chain/collection';
import { CHAIN_STATE_ALL_COLLECTION, CHAIN_STATE_COLLECTION } from '../constants/codec';
import { AllCollection, CollectionAsset } from '../../../../types/core/chain/collection';

export const getAllCollection = async (stateStore: StateStore): Promise<AllCollection> => {
  const collectionBuffer = await stateStore.chain.get(CHAIN_STATE_ALL_COLLECTION);
  if (!collectionBuffer) {
    return {
      items: [],
    };
  }

  const allCollection = codec.decode<AllCollection>(allCollectionSchema, collectionBuffer);
  return allCollection;
};

export const setAllCollection = async (stateStore: StateStore, allCollection: AllCollection) => {
  await stateStore.chain.set(
    CHAIN_STATE_ALL_COLLECTION,
    codec.encode(allCollectionSchema, allCollection),
  );
};

export const getCollectionById = async (
  stateStore: StateStore,
  id: string,
): Promise<CollectionAsset | undefined> => {
  const collectionBuffer = await stateStore.chain.get(`${CHAIN_STATE_COLLECTION}:${id}`);
  if (!collectionBuffer) {
    return undefined;
  }
  return codec.decode<CollectionAsset>(collectionSchema, collectionBuffer);
};

export const setCollectionById = async (
  stateStore: StateStore,
  id: string,
  collection: CollectionAsset,
) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_COLLECTION}:${id}`,
    codec.encode(collectionSchema, collection),
  );
};
