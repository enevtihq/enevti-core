import { BaseModuleDataAccess, StateStore } from 'lisk-framework';
import { codec } from 'lisk-sdk';
import { LikedAsset } from '../../../../../../types/core/chain/engagement';
import { CHAIN_STATE_LIKED } from '../../../constants/codec';
import { likedAtSchema } from '../../../schemas/chain/engagement';

export const accessLiked = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
  address: string,
): Promise<0 | 1> => {
  const likedBuffer = await dataAccess.getChainState(`${CHAIN_STATE_LIKED}:${id}:${address}`);
  if (!likedBuffer) {
    return 0;
  }
  return codec.decode<LikedAsset>(likedAtSchema, likedBuffer).status;
};

export const getLiked = async (
  stateStore: StateStore,
  id: string,
  address: string,
): Promise<0 | 1> => {
  const likedBuffer = await stateStore.chain.get(`${CHAIN_STATE_LIKED}:${id}:${address}`);
  if (!likedBuffer) {
    return 0;
  }
  return codec.decode<LikedAsset>(likedAtSchema, likedBuffer).status;
};

export const setLiked = async (
  stateStore: StateStore,
  id: string,
  address: string,
  status: 0 | 1,
) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_LIKED}:${id}:${address}`,
    codec.encode(likedAtSchema, { status }),
  );
};
