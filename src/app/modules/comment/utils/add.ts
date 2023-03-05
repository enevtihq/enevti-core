import { ReducerHandler, StateStore } from 'lisk-sdk';
import { AddCommentPayload } from 'enevti-types/param/comment';
import { getComment, setComment } from './item';
import { getComments, setComments } from './list';
import { COMMENT_PREFIX } from '../constants/codec';
import { getBlockTimestamp } from './timestamp';

export const addComment = async (
  stateStore: StateStore,
  reducerHandler: ReducerHandler,
  addCommentPayload: AddCommentPayload,
) => {
  const { id, identifier, ...commentPayload } = addCommentPayload;

  const existingComment = await getComment(stateStore, id);
  if (existingComment) {
    throw new Error('Comment with provided id already exist');
  }

  const comment = {
    ...commentPayload,
    date: getBlockTimestamp(stateStore),
  };
  await setComment(stateStore, id, comment);

  const commentItem = (await getComments(
    stateStore,
    identifier,
    comment.target.toString('hex'),
  )) ?? { items: [] };
  commentItem.items.unshift(id);
  await setComments(stateStore, identifier, comment.target.toString('hex'), commentItem);

  await reducerHandler.invoke('count:addCount', {
    module: COMMENT_PREFIX,
    key: identifier,
    address: addCommentPayload.creator,
    item: id,
  });
};
