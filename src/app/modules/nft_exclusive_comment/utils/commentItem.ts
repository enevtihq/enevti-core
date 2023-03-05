import { ExclusiveCommentItemChain } from 'enevti-types/chain/nft_exclusive_comment';
import { codec, StateStore, BaseModuleDataAccess } from 'lisk-sdk';
import { EXCLUSIVE_COMMENT_PREFIX } from '../constants/codec';
import { commentItemSchema } from '../schema/commentItem';

export const accessExclusiveComment = async (
  dataAccess: BaseModuleDataAccess,
  id: Buffer,
): Promise<ExclusiveCommentItemChain | undefined> => {
  const commentBuffer = await dataAccess.getChainState(
    `${EXCLUSIVE_COMMENT_PREFIX}:${id.toString('hex')}`,
  );
  if (!commentBuffer) {
    return undefined;
  }
  return codec.decode<ExclusiveCommentItemChain>(commentItemSchema, commentBuffer);
};

export const getExclusiveComment = async (
  stateStore: StateStore,
  id: Buffer,
): Promise<ExclusiveCommentItemChain | undefined> => {
  const commentBuffer = await stateStore.chain.get(
    `${EXCLUSIVE_COMMENT_PREFIX}:${id.toString('hex')}`,
  );
  if (!commentBuffer) {
    return undefined;
  }
  return codec.decode<ExclusiveCommentItemChain>(commentItemSchema, commentBuffer);
};

export const setExclusiveComment = async (
  stateStore: StateStore,
  id: Buffer,
  comment: ExclusiveCommentItemChain,
) => {
  await stateStore.chain.set(
    `${EXCLUSIVE_COMMENT_PREFIX}:${id.toString('hex')}`,
    codec.encode(commentItemSchema, comment),
  );
};
