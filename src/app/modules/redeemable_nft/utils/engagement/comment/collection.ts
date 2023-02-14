import { BaseModuleDataAccess, StateStore } from 'lisk-framework';
import { codec } from 'lisk-sdk';
import { CommentAtAsset, CommentAsset } from 'enevti-types/chain/engagement';
import { CHAIN_STATE_COMMENT } from '../../../constants/codec';
import { commentAtSchema } from '../../../schemas/chain/engagement';
import { getCommentById, setCommentById } from './comment';

export const accessCollectionCommentById = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
): Promise<CommentAtAsset> => {
  const commentCollectionBuffer = await dataAccess.getChainState(
    `${CHAIN_STATE_COMMENT}:collection:${id}`,
  );
  if (!commentCollectionBuffer) {
    return { comment: [] };
  }
  return codec.decode<CommentAtAsset>(commentAtSchema, commentCollectionBuffer);
};

export const getCollectionCommentById = async (
  stateStore: StateStore,
  id: string,
): Promise<CommentAtAsset> => {
  const commentCollectionBuffer = await stateStore.chain.get(
    `${CHAIN_STATE_COMMENT}:collection:${id}`,
  );
  if (!commentCollectionBuffer) {
    return { comment: [] };
  }
  return codec.decode<CommentAtAsset>(commentAtSchema, commentCollectionBuffer);
};

export const setCollectionCommentById = async (
  stateStore: StateStore,
  id: string,
  comment: CommentAtAsset,
) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_COMMENT}:collection:${id}`,
    codec.encode(commentAtSchema, comment),
  );
};

export const addCollectionCommentById = async (
  stateStore: StateStore,
  id: string,
  comment: CommentAsset,
) => {
  const commentCollection = await getCollectionCommentById(stateStore, id);
  if (!commentCollection) {
    await setCollectionCommentById(stateStore, id, { comment: [comment.id] });
    return;
  }

  commentCollection.comment.unshift(comment.id);
  await setCollectionCommentById(stateStore, id, commentCollection);

  const commentBuffer = await getCommentById(stateStore, comment.id.toString('hex'));
  if (!commentBuffer) {
    await setCommentById(stateStore, comment.id.toString('hex'), comment);
  } else {
    throw Error('Comment already exist');
  }
};
