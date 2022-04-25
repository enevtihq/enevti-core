import { codec, StateStore, BaseModuleDataAccess } from 'lisk-sdk';
import { CHAIN_STATE_ACTIVITY_COLLECTION, CHAIN_STATE_ACTIVITY_NFT } from '../constants/codec';
import { activityCollectionSchema, activityNFTSchema } from '../schemas/chain/activity';
import {
  CollectionActivityChain,
  CollectionActivityChainItems,
} from '../../../../types/core/chain/collection';
import {
  NFTActivityChain,
  NFTActivityChainItems,
} from '../../../../types/core/chain/nft/NFTActivity';

export const accessActivityNFT = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
): Promise<NFTActivityChain> => {
  const activityBuffer = await dataAccess.getChainState(`${CHAIN_STATE_ACTIVITY_NFT}:${id}`);
  if (!activityBuffer) {
    return { items: [] };
  }
  return codec.decode<NFTActivityChain>(activityNFTSchema, activityBuffer);
};

export const getActivityNFT = async (
  stateStore: StateStore,
  id: string,
): Promise<NFTActivityChain> => {
  const activityBuffer = await stateStore.chain.get(`${CHAIN_STATE_ACTIVITY_NFT}:${id}`);
  if (!activityBuffer) {
    return { items: [] };
  }
  return codec.decode<NFTActivityChain>(activityNFTSchema, activityBuffer);
};

export const setActivityNFT = async (
  stateStore: StateStore,
  id: string,
  activityChain: NFTActivityChain,
) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_ACTIVITY_NFT}:${id}`,
    codec.encode(activityNFTSchema, activityChain),
  );
};

export const addActivityNFT = async (
  stateStore: StateStore,
  id: string,
  activityItem: NFTActivityChainItems,
) => {
  const activityChain = await getActivityNFT(stateStore, id);
  activityChain.items.unshift(activityItem);
  await setActivityNFT(stateStore, id, activityChain);
};

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
