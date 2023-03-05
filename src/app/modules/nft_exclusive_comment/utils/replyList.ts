import { ExclusiveReplyListChain } from 'enevti-types/chain/nft_exclusive_comment';
import { codec, StateStore, BaseModuleDataAccess } from 'lisk-sdk';
import { EXCLUSIVE_COMMENT_PREFIX, EXCLUSIVE_REPLY_PREFIX } from '../constants/codec';
import { replyListSchema } from '../schema/replyList';

export const accessExclusiveReplies = async (
  dataAccess: BaseModuleDataAccess,
  id: Buffer,
): Promise<ExclusiveReplyListChain | undefined> => {
  const repliesBuffer = await dataAccess.getChainState(
    `${EXCLUSIVE_COMMENT_PREFIX}:${id.toString('hex')}:${EXCLUSIVE_REPLY_PREFIX}`,
  );
  if (!repliesBuffer) {
    return undefined;
  }
  return codec.decode<ExclusiveReplyListChain>(replyListSchema, repliesBuffer);
};

export const getExclusiveReplies = async (
  stateStore: StateStore,
  id: Buffer,
): Promise<ExclusiveReplyListChain | undefined> => {
  const repliesBuffer = await stateStore.chain.get(
    `${EXCLUSIVE_COMMENT_PREFIX}:${id.toString('hex')}:${EXCLUSIVE_REPLY_PREFIX}`,
  );
  if (!repliesBuffer) {
    return undefined;
  }
  return codec.decode<ExclusiveReplyListChain>(replyListSchema, repliesBuffer);
};

export const setExclusiveReplies = async (
  stateStore: StateStore,
  id: Buffer,
  replies: ExclusiveReplyListChain,
) => {
  await stateStore.chain.set(
    `${EXCLUSIVE_COMMENT_PREFIX}:${id.toString('hex')}:${EXCLUSIVE_REPLY_PREFIX}`,
    codec.encode(replyListSchema, replies),
  );
};
