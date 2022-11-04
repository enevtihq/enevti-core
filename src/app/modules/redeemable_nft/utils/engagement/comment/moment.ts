import { BaseModuleDataAccess, StateStore } from 'lisk-framework';
import { codec } from 'lisk-sdk';
import { CommentAtAsset, CommentAsset } from '../../../../../../types/core/chain/engagement';
import { CHAIN_STATE_COMMENT } from '../../../constants/codec';
import { commentAtSchema } from '../../../schemas/chain/engagement';
import { getCommentById, setCommentById } from './comment';

export const accessMomentCommentById = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
): Promise<CommentAtAsset> => {
  const commentMomentBuffer = await dataAccess.getChainState(`${CHAIN_STATE_COMMENT}:moment:${id}`);
  if (!commentMomentBuffer) {
    return { comment: [] };
  }
  return codec.decode<CommentAtAsset>(commentAtSchema, commentMomentBuffer);
};

export const getMomentCommentById = async (
  stateStore: StateStore,
  id: string,
): Promise<CommentAtAsset> => {
  const commentMomentBuffer = await stateStore.chain.get(`${CHAIN_STATE_COMMENT}:moment:${id}`);
  if (!commentMomentBuffer) {
    return { comment: [] };
  }
  return codec.decode<CommentAtAsset>(commentAtSchema, commentMomentBuffer);
};

export const setMomentCommentById = async (
  stateStore: StateStore,
  id: string,
  comment: CommentAtAsset,
) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_COMMENT}:moment:${id}`,
    codec.encode(commentAtSchema, comment),
  );
};

export const addMomentCommentById = async (
  stateStore: StateStore,
  id: string,
  comment: CommentAsset,
) => {
  const commentMoment = await getMomentCommentById(stateStore, id);
  if (!commentMoment) {
    await setMomentCommentById(stateStore, id, { comment: [comment.id] });
    return;
  }

  commentMoment.comment.unshift(comment.id);
  await setMomentCommentById(stateStore, id, commentMoment);

  const commentBuffer = await getCommentById(stateStore, comment.id.toString('hex'));
  if (!commentBuffer) {
    await setCommentById(stateStore, comment.id.toString('hex'), comment);
  } else {
    throw Error('Comment already exist');
  }
};
