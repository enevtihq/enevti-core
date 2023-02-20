import { LikeChain } from 'enevti-types/chain/like';
import { codec, StateStore, BaseModuleDataAccess } from 'lisk-sdk';
import { LIKE_MODULE_PREFIX, LIKE_PREFIX } from '../constants/codec';
import { likeSchema } from '../schema/like';

export const accessLike = async (
  dataAccess: BaseModuleDataAccess,
  identifier: string,
  target: string,
): Promise<LikeChain | undefined> => {
  const likeBuffer = await dataAccess.getChainState(
    `${LIKE_MODULE_PREFIX}:${identifier}:${target}:${LIKE_PREFIX}`,
  );
  if (!likeBuffer) {
    return undefined;
  }
  return codec.decode<LikeChain>(likeSchema, likeBuffer);
};

export const getLike = async (
  stateStore: StateStore,
  identifier: string,
  target: string,
): Promise<LikeChain | undefined> => {
  const likeBuffer = await stateStore.chain.get(
    `${LIKE_MODULE_PREFIX}:${identifier}:${target}:${LIKE_PREFIX}`,
  );
  if (!likeBuffer) {
    return undefined;
  }
  return codec.decode<LikeChain>(likeSchema, likeBuffer);
};

export const setLike = async (
  stateStore: StateStore,
  identifier: string,
  target: string,
  like: LikeChain,
) => {
  await stateStore.chain.set(
    `${LIKE_MODULE_PREFIX}:${identifier}:${target}:${LIKE_PREFIX}`,
    codec.encode(likeSchema, like),
  );
};
