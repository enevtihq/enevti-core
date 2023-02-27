import { CommentItemChain } from 'enevti-types/chain/comment';
import { codec, StateStore, BaseModuleDataAccess } from 'lisk-sdk';
import { COMMENT_PREFIX } from '../constants/codec';
import { commentItemSchema } from '../schema/item';

export const accessComment = async (
  dataAccess: BaseModuleDataAccess,
  id: Buffer,
): Promise<CommentItemChain | undefined> => {
  const commentBuffer = await dataAccess.getChainState(`${COMMENT_PREFIX}:${id.toString('hex')}`);
  if (!commentBuffer) {
    return undefined;
  }
  return codec.decode<CommentItemChain>(commentItemSchema, commentBuffer);
};

export const getComment = async (
  stateStore: StateStore,
  id: Buffer,
): Promise<CommentItemChain | undefined> => {
  const commentBuffer = await stateStore.chain.get(`${COMMENT_PREFIX}:${id.toString('hex')}`);
  if (!commentBuffer) {
    return undefined;
  }
  return codec.decode<CommentItemChain>(commentItemSchema, commentBuffer);
};

export const setComment = async (stateStore: StateStore, id: Buffer, comment: CommentItemChain) => {
  await stateStore.chain.set(
    `${COMMENT_PREFIX}:${id.toString('hex')}`,
    codec.encode(commentItemSchema, comment),
  );
};
