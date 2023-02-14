import { BaseModuleDataAccess, StateStore } from 'lisk-framework';
import { codec } from 'lisk-sdk';
import { CommentClubsAtAsset, CommentClubsAsset } from 'enevti-types/chain/engagement';
import { CHAIN_STATE_COMMENT_CLUBS } from '../../../constants/codec';
import { commentClubsAtSchema } from '../../../schemas/chain/engagement';
import { getCommentClubsById, setCommentClubsById } from './clubs';

export const accessMomentCommentClubsById = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
): Promise<CommentClubsAtAsset> => {
  const commentMomentBuffer = await dataAccess.getChainState(
    `${CHAIN_STATE_COMMENT_CLUBS}:moment:${id}`,
  );
  if (!commentMomentBuffer) {
    return { clubs: [] };
  }
  return codec.decode<CommentClubsAtAsset>(commentClubsAtSchema, commentMomentBuffer);
};

export const getMomentCommentClubsById = async (
  stateStore: StateStore,
  id: string,
): Promise<CommentClubsAtAsset> => {
  const commentMomentBuffer = await stateStore.chain.get(
    `${CHAIN_STATE_COMMENT_CLUBS}:moment:${id}`,
  );
  if (!commentMomentBuffer) {
    return { clubs: [] };
  }
  return codec.decode<CommentClubsAtAsset>(commentClubsAtSchema, commentMomentBuffer);
};

export const setMomentCommentClubsById = async (
  stateStore: StateStore,
  id: string,
  clubs: CommentClubsAtAsset,
) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_COMMENT_CLUBS}:moment:${id}`,
    codec.encode(commentClubsAtSchema, clubs),
  );
};

export const addMomentCommentClubsById = async (
  stateStore: StateStore,
  id: string,
  clubs: CommentClubsAsset,
) => {
  const commentMoment = await getMomentCommentClubsById(stateStore, id);
  if (!commentMoment) {
    await setMomentCommentClubsById(stateStore, id, { clubs: [clubs.id] });
    return;
  }

  commentMoment.clubs.unshift(clubs.id);
  await setMomentCommentClubsById(stateStore, id, commentMoment);

  const commentBuffer = await getCommentClubsById(stateStore, clubs.id.toString('hex'));
  if (!commentBuffer) {
    await setCommentClubsById(stateStore, clubs.id.toString('hex'), clubs);
  } else {
    throw Error('Comment already exist');
  }
};
