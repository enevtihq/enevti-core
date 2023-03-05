import { ExclusiveCommentListChain } from 'enevti-types/chain/nft_exclusive_comment';
import { codec, StateStore, BaseModuleDataAccess } from 'lisk-sdk';
import { EXCLUSIVE_COMMENT_PREFIX } from '../constants/codec';
import { commentListSchema } from '../schema/commentList';

export const accessExclusiveComments = async (
  dataAccess: BaseModuleDataAccess,
  identifier: string,
  key: string,
): Promise<ExclusiveCommentListChain | undefined> => {
  const commentsBuffer = await dataAccess.getChainState(
    `${EXCLUSIVE_COMMENT_PREFIX}:${identifier}:${key}`,
  );
  if (!commentsBuffer) {
    return undefined;
  }
  return codec.decode<ExclusiveCommentListChain>(commentListSchema, commentsBuffer);
};

export const getExclusiveComments = async (
  stateStore: StateStore,
  identifier: string,
  key: string,
): Promise<ExclusiveCommentListChain | undefined> => {
  const commentsBuffer = await stateStore.chain.get(
    `${EXCLUSIVE_COMMENT_PREFIX}:${identifier}:${key}`,
  );
  if (!commentsBuffer) {
    return undefined;
  }
  return codec.decode<ExclusiveCommentListChain>(commentListSchema, commentsBuffer);
};

export const setExclusiveComments = async (
  stateStore: StateStore,
  identifier: string,
  key: string,
  comments: ExclusiveCommentListChain,
) => {
  await stateStore.chain.set(
    `${EXCLUSIVE_COMMENT_PREFIX}:${identifier}:${key}`,
    codec.encode(commentListSchema, comments),
  );
};
