import { BaseModuleDataAccess, StateStore } from 'lisk-framework';
import { codec } from 'lisk-sdk';
import { NFTActivityChain, NFTActivityChainItems } from 'enevti-types/chain/nft/NFTActivity';
import { CHAIN_STATE_ACTIVITY_NFT } from '../../constants/codec';
import { activityNFTSchema } from '../../schemas/chain/activity';

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
