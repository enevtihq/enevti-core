import { LikedChain } from 'enevti-types/chain/like';
import { codec, StateStore, BaseModuleDataAccess } from 'lisk-sdk';
import { LIKED_PREFIX, LIKE_MODULE_PREFIX } from '../constants/codec';
import { likedSchema } from '../schema/liked';

export const accessLiked = async (
  dataAccess: BaseModuleDataAccess,
  target: string,
  address: Buffer,
): Promise<LikedChain | undefined> => {
  const likedBuffer = await dataAccess.getChainState(
    `${LIKE_MODULE_PREFIX}:${LIKED_PREFIX}:${target}:${address.toString('hex')}`,
  );
  if (!likedBuffer) {
    return undefined;
  }
  return codec.decode<LikedChain>(likedSchema, likedBuffer);
};

export const getLiked = async (
  stateStore: StateStore,
  target: string,
  address: Buffer,
): Promise<LikedChain | undefined> => {
  const likedBuffer = await stateStore.chain.get(
    `${LIKE_MODULE_PREFIX}:${LIKED_PREFIX}:${target}:${address.toString('hex')}`,
  );
  if (!likedBuffer) {
    return undefined;
  }
  return codec.decode<LikedChain>(likedSchema, likedBuffer);
};

export const setLiked = async (
  stateStore: StateStore,
  target: string,
  address: Buffer,
  liked: LikedChain,
) => {
  await stateStore.chain.set(
    `${LIKE_MODULE_PREFIX}:${LIKED_PREFIX}:${target}:${address.toString('hex')}`,
    codec.encode(likedSchema, liked),
  );
};
