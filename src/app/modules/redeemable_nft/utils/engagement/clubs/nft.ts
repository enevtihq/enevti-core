import { BaseModuleDataAccess, StateStore } from 'lisk-framework';
import { codec } from 'lisk-sdk';
import { CommentClubsAtAsset, CommentClubsAsset } from 'enevti-types/chain/engagement';
import { CHAIN_STATE_COMMENT_CLUBS } from '../../../constants/codec';
import { commentClubsAtSchema } from '../../../schemas/chain/engagement';
import { getCommentClubsById, setCommentClubsById } from './clubs';

export const accessNftCommentClubsById = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
): Promise<CommentClubsAtAsset> => {
  const commentNftBuffer = await dataAccess.getChainState(`${CHAIN_STATE_COMMENT_CLUBS}:nft:${id}`);
  if (!commentNftBuffer) {
    return { clubs: [] };
  }
  return codec.decode<CommentClubsAtAsset>(commentClubsAtSchema, commentNftBuffer);
};

export const getNftCommentClubsById = async (
  stateStore: StateStore,
  id: string,
): Promise<CommentClubsAtAsset> => {
  const commentNftBuffer = await stateStore.chain.get(`${CHAIN_STATE_COMMENT_CLUBS}:nft:${id}`);
  if (!commentNftBuffer) {
    return { clubs: [] };
  }
  return codec.decode<CommentClubsAtAsset>(commentClubsAtSchema, commentNftBuffer);
};

export const setNftCommentClubsById = async (
  stateStore: StateStore,
  id: string,
  clubs: CommentClubsAtAsset,
) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_COMMENT_CLUBS}:nft:${id}`,
    codec.encode(commentClubsAtSchema, clubs),
  );
};

export const addNftCommentClubsById = async (
  stateStore: StateStore,
  id: string,
  clubs: CommentClubsAsset,
) => {
  const commentNft = await getNftCommentClubsById(stateStore, id);
  if (!commentNft) {
    await setNftCommentClubsById(stateStore, id, { clubs: [clubs.id] });
    return;
  }

  commentNft.clubs.unshift(clubs.id);
  await setNftCommentClubsById(stateStore, id, commentNft);

  const commentBuffer = await getCommentClubsById(stateStore, clubs.id.toString('hex'));
  if (!commentBuffer) {
    await setCommentClubsById(stateStore, clubs.id.toString('hex'), clubs);
  } else {
    throw Error('Comment already exist');
  }
};
