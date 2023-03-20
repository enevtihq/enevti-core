import { ReducerHandler, StateStore } from 'lisk-sdk';
import { AddExclusiveReplyPayload } from 'enevti-types/param/nft_exclusive_comment';
import { getBlockTimestamp } from './timestamp';
import { getExclusiveReply, setExclusiveReply } from './replyItem';
import { getExclusiveReplies, setExclusiveReplies } from './replyList';
import { EXCLUSIVE_COMMENT_PREFIX, EXCLUSIVE_REPLY_PREFIX } from '../constants/codec';
import { getExclusiveComment } from './commentItem';
import { isTargetEligible } from './eligibility';

export const addExclusiveReply = async (
  stateStore: StateStore,
  reducerHandler: ReducerHandler,
  addExclusiveReplyPayload: AddExclusiveReplyPayload,
) => {
  const { id, ...replyPayload } = addExclusiveReplyPayload;

  const existingReply = await getExclusiveReply(stateStore, id);
  if (existingReply) {
    throw new Error('Reply with provided id already exist');
  }

  const comment = await getExclusiveComment(stateStore, replyPayload.target);
  if (!comment) {
    throw new Error('Reply target is not a comment');
  }

  const eligible = await isTargetEligible(reducerHandler, comment.target, replyPayload.creator);
  if (!eligible) {
    throw new Error('Not authorized to give exclusive reply on this target');
  }

  const reply = {
    ...replyPayload,
    date: BigInt(getBlockTimestamp(stateStore)),
  };
  await setExclusiveReply(stateStore, id, reply);

  const replyItem = (await getExclusiveReplies(stateStore, reply.target)) ?? { items: [] };
  replyItem.items.unshift(id);
  await setExclusiveReplies(stateStore, reply.target, replyItem);

  await reducerHandler.invoke('count:addCount', {
    module: EXCLUSIVE_COMMENT_PREFIX,
    key: EXCLUSIVE_REPLY_PREFIX,
    address: addExclusiveReplyPayload.creator,
    item: id,
  });
};
