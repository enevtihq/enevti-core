import { BaseModuleDataAccess, StateStore } from 'lisk-framework';
import { codec } from 'lisk-sdk';
import { CommentClubsAtAsset, CommentClubsAsset } from 'enevti-types/chain/engagement';
import { CHAIN_STATE_COMMENT_CLUBS } from '../../../constants/codec';
import { commentClubsAtSchema } from '../../../schemas/chain/engagement';
import { getCommentClubsById, setCommentClubsById } from './clubs';

export const accessCollectionCommentClubsById = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
): Promise<CommentClubsAtAsset> => {
  const commentCollectionBuffer = await dataAccess.getChainState(
    `${CHAIN_STATE_COMMENT_CLUBS}:collection:${id}`,
  );
  if (!commentCollectionBuffer) {
    return { clubs: [] };
  }
  return codec.decode<CommentClubsAtAsset>(commentClubsAtSchema, commentCollectionBuffer);
};

export const getCollectionCommentClubsById = async (
  stateStore: StateStore,
  id: string,
): Promise<CommentClubsAtAsset> => {
  const commentCollectionBuffer = await stateStore.chain.get(
    `${CHAIN_STATE_COMMENT_CLUBS}:collection:${id}`,
  );
  if (!commentCollectionBuffer) {
    return { clubs: [] };
  }
  return codec.decode<CommentClubsAtAsset>(commentClubsAtSchema, commentCollectionBuffer);
};

export const setCollectionCommentClubsById = async (
  stateStore: StateStore,
  id: string,
  clubs: CommentClubsAtAsset,
) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_COMMENT_CLUBS}:collection:${id}`,
    codec.encode(commentClubsAtSchema, clubs),
  );
};

export const addCollectionCommentClubsById = async (
  stateStore: StateStore,
  id: string,
  clubs: CommentClubsAsset,
) => {
  const commentCollection = await getCollectionCommentClubsById(stateStore, id);
  if (!commentCollection) {
    await setCollectionCommentClubsById(stateStore, id, { clubs: [clubs.id] });
    return;
  }

  commentCollection.clubs.unshift(clubs.id);
  await setCollectionCommentClubsById(stateStore, id, commentCollection);

  const commentBuffer = await getCommentClubsById(stateStore, clubs.id.toString('hex'));
  if (!commentBuffer) {
    await setCommentClubsById(stateStore, clubs.id.toString('hex'), clubs);
  } else {
    throw Error('Comment already exist');
  }
};
