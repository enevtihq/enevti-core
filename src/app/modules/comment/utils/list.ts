import { CommentListChain } from 'enevti-types/chain/comment';
import { codec, StateStore, BaseModuleDataAccess } from 'lisk-sdk';
import { COMMENT_PREFIX } from '../constants/codec';
import { commentListSchema } from '../schema/list';

export const accessComments = async (
  dataAccess: BaseModuleDataAccess,
  identifier: string,
  key: string,
): Promise<CommentListChain | undefined> => {
  const commentsBuffer = await dataAccess.getChainState(`${COMMENT_PREFIX}:${identifier}:${key}`);
  if (!commentsBuffer) {
    return undefined;
  }
  return codec.decode<CommentListChain>(commentListSchema, commentsBuffer);
};

export const getComments = async (
  stateStore: StateStore,
  identifier: string,
  key: string,
): Promise<CommentListChain | undefined> => {
  const commentsBuffer = await stateStore.chain.get(`${COMMENT_PREFIX}:${identifier}:${key}`);
  if (!commentsBuffer) {
    return undefined;
  }
  return codec.decode<CommentListChain>(commentListSchema, commentsBuffer);
};

export const setComments = async (
  stateStore: StateStore,
  identifier: string,
  key: string,
  comments: CommentListChain,
) => {
  await stateStore.chain.set(
    `${COMMENT_PREFIX}:${identifier}:${key}`,
    codec.encode(commentListSchema, comments),
  );
};
