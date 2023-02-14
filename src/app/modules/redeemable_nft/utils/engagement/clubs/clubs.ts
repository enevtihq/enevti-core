import { BaseModuleDataAccess, StateStore } from 'lisk-framework';
import { codec } from 'lisk-sdk';
import { CommentClubsAsset } from 'enevti-types/chain/engagement';
import { CHAIN_STATE_COMMENT_CLUBS } from '../../../constants/codec';
import { commentClubsSchema } from '../../../schemas/chain/engagement';

export const accessCommentClubsById = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
): Promise<CommentClubsAsset | undefined> => {
  const commentBuffer = await dataAccess.getChainState(`${CHAIN_STATE_COMMENT_CLUBS}:${id}`);
  if (!commentBuffer) {
    return undefined;
  }
  return codec.decode<CommentClubsAsset>(commentClubsSchema, commentBuffer);
};

export const getCommentClubsById = async (
  stateStore: StateStore,
  id: string,
): Promise<CommentClubsAsset | undefined> => {
  const commentBuffer = await stateStore.chain.get(`${CHAIN_STATE_COMMENT_CLUBS}:${id}`);
  if (!commentBuffer) {
    return undefined;
  }
  return codec.decode<CommentClubsAsset>(commentClubsSchema, commentBuffer);
};

export const setCommentClubsById = async (
  stateStore: StateStore,
  id: string,
  clubs: CommentClubsAsset,
) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_COMMENT_CLUBS}:${id}`,
    codec.encode(commentClubsSchema, clubs),
  );
};
