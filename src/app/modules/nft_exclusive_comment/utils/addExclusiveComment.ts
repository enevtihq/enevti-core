import { ReducerHandler, StateStore } from 'lisk-sdk';
import { AddExclusiveCommentPayload } from 'enevti-types/param/nft_exclusive_comment';
import { getExclusiveComment, setExclusiveComment } from './commentItem';
import { getExclusiveComments, setExclusiveComments } from './commentList';
import { EXCLUSIVE_COMMENT_PREFIX } from '../constants/codec';
import { getBlockTimestamp } from './timestamp';
import { isTargetEligible } from './eligibility';

export const addExclusiveComment = async (
  stateStore: StateStore,
  reducerHandler: ReducerHandler,
  addExclusiveCommentPayload: AddExclusiveCommentPayload,
) => {
  const { id, identifier, ...exclusiveCommentPayload } = addExclusiveCommentPayload;

  const existingExclusiveComment = await getExclusiveComment(stateStore, id);
  if (existingExclusiveComment) {
    throw new Error('Exclusive Comment with provided id already exist');
  }

  const eligible = await isTargetEligible(
    reducerHandler,
    exclusiveCommentPayload.target,
    exclusiveCommentPayload.creator,
  );
  if (!eligible) {
    throw new Error('Not authorized to give exclusive comment on this target');
  }

  const exclusiveComment = {
    ...exclusiveCommentPayload,
    date: BigInt(getBlockTimestamp(stateStore)),
  };
  await setExclusiveComment(stateStore, id, exclusiveComment);

  const exclusiveCommentItem = (await getExclusiveComments(
    stateStore,
    identifier,
    exclusiveComment.target.toString('hex'),
  )) ?? { items: [] };
  exclusiveCommentItem.items.unshift(id);
  await setExclusiveComments(
    stateStore,
    identifier,
    exclusiveComment.target.toString('hex'),
    exclusiveCommentItem,
  );

  await reducerHandler.invoke('count:addCount', {
    module: EXCLUSIVE_COMMENT_PREFIX,
    key: identifier,
    address: addExclusiveCommentPayload.creator,
    item: id,
  });
};
