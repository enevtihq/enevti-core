import { BaseModuleDataAccess, StateStore } from 'lisk-framework';
import { codec } from 'lisk-sdk';
import {
  CollectionActivityChain,
  CollectionActivityChainItems,
} from '../../../../../types/core/chain/collection';
import { CHAIN_STATE_ACTIVITY_COLLECTION } from '../../constants/codec';
import { activityCollectionSchema } from '../../schemas/chain/activity';

export const accessActivityCollection = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
): Promise<CollectionActivityChain> => {
  const activityBuffer = await dataAccess.getChainState(`${CHAIN_STATE_ACTIVITY_COLLECTION}:${id}`);
  if (!activityBuffer) {
    return { items: [] };
  }
  return codec.decode<CollectionActivityChain>(activityCollectionSchema, activityBuffer);
};

export const getActivityCollection = async (
  stateStore: StateStore,
  id: string,
): Promise<CollectionActivityChain> => {
  const activityBuffer = await stateStore.chain.get(`${CHAIN_STATE_ACTIVITY_COLLECTION}:${id}`);
  if (!activityBuffer) {
    return { items: [] };
  }
  return codec.decode<CollectionActivityChain>(activityCollectionSchema, activityBuffer);
};

export const setActivityCollection = async (
  stateStore: StateStore,
  id: string,
  collection: CollectionActivityChain,
) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_ACTIVITY_COLLECTION}:${id}`,
    codec.encode(activityCollectionSchema, collection),
  );
};

export const addActivityCollection = async (
  stateStore: StateStore,
  id: string,
  activityItem: CollectionActivityChainItems,
) => {
  const activityChain = await getActivityCollection(stateStore, id);
  activityChain.items.unshift(activityItem);
  await setActivityCollection(stateStore, id, activityChain);
};
