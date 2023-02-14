import { codec, StateStore, BaseModuleDataAccess } from 'lisk-sdk';
import {
  allCollectionSchema,
  allUnavailableCollectionSchema,
  collectionSchema,
} from '../schemas/chain/collection';
import {
  CHAIN_STATE_ALL_COLLECTION,
  CHAIN_STATE_ALL_UNAVAILABLE_COLLECTION,
  CHAIN_STATE_COLLECTION,
} from '../constants/codec';
import { AllCollection, CollectionAsset } from 'enevti-types/chain/collection';
import { createPagination } from './transaction';

export const accessAllCollection = async (
  dataAccess: BaseModuleDataAccess,
  offset = 0,
  limit?: number,
  version?: number,
): Promise<{ allCollection: AllCollection; version: number }> => {
  const collectionBuffer = await dataAccess.getChainState(CHAIN_STATE_ALL_COLLECTION);
  if (!collectionBuffer) {
    return {
      allCollection: {
        items: [],
      },
      version: 0,
    };
  }

  const allCollection = codec.decode<AllCollection>(allCollectionSchema, collectionBuffer);
  const { v, o, c } = createPagination(allCollection.items.length, version, offset, limit);
  allCollection.items.slice(o, c);
  return { allCollection, version: v };
};

export const getAllCollection = async (
  stateStore: StateStore,
  offset = 0,
  limit?: number,
  version?: number,
): Promise<AllCollection> => {
  const collectionBuffer = await stateStore.chain.get(CHAIN_STATE_ALL_COLLECTION);
  if (!collectionBuffer) {
    return {
      items: [],
    };
  }

  const allCollection = codec.decode<AllCollection>(allCollectionSchema, collectionBuffer);
  const { o, c } = createPagination(allCollection.items.length, version, offset, limit);
  allCollection.items.slice(o, c);
  return allCollection;
};

export const setAllCollection = async (stateStore: StateStore, allCollection: AllCollection) => {
  await stateStore.chain.set(
    CHAIN_STATE_ALL_COLLECTION,
    codec.encode(allCollectionSchema, allCollection),
  );
};

export const accessAllUnavailableCollection = async (
  dataAccess: BaseModuleDataAccess,
  offset = 0,
  limit?: number,
  version?: number,
): Promise<{ allUnavailableCollection: AllCollection; version: number }> => {
  const collectionBuffer = await dataAccess.getChainState(CHAIN_STATE_ALL_UNAVAILABLE_COLLECTION);
  if (!collectionBuffer) {
    return {
      allUnavailableCollection: {
        items: [],
      },
      version: 0,
    };
  }

  const allUnavailableCollection = codec.decode<AllCollection>(
    allUnavailableCollectionSchema,
    collectionBuffer,
  );
  const { v, o, c } = createPagination(
    allUnavailableCollection.items.length,
    version,
    offset,
    limit,
  );
  allUnavailableCollection.items.slice(o, c);
  return { allUnavailableCollection, version: v };
};

export const getAllUnavailableCollection = async (
  stateStore: StateStore,
  offset = 0,
  limit?: number,
  version?: number,
): Promise<AllCollection> => {
  const collectionBuffer = await stateStore.chain.get(CHAIN_STATE_ALL_UNAVAILABLE_COLLECTION);
  if (!collectionBuffer) {
    return {
      items: [],
    };
  }

  const allCollection = codec.decode<AllCollection>(
    allUnavailableCollectionSchema,
    collectionBuffer,
  );
  const { o, c } = createPagination(allCollection.items.length, version, offset, limit);
  allCollection.items.slice(o, c);
  return allCollection;
};

export const setAllUnavailableCollection = async (
  stateStore: StateStore,
  allCollection: AllCollection,
) => {
  await stateStore.chain.set(
    CHAIN_STATE_ALL_UNAVAILABLE_COLLECTION,
    codec.encode(allUnavailableCollectionSchema, allCollection),
  );
};

export const accessCollectionById = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
): Promise<CollectionAsset | undefined> => {
  const collectionBuffer = await dataAccess.getChainState(`${CHAIN_STATE_COLLECTION}:${id}`);
  if (!collectionBuffer) {
    return undefined;
  }
  return codec.decode<CollectionAsset>(collectionSchema, collectionBuffer);
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

export function isMintingAvailable(collection: CollectionAsset, now: number) {
  return (
    (collection.minting.expire === 0 && collection.minting.available.length > 0) ||
    (collection.minting.expire > now && collection.minting.available.length > 0)
  );
}
