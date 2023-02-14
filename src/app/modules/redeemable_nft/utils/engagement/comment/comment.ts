import { BaseModuleDataAccess, StateStore } from 'lisk-framework';
import { codec } from 'lisk-sdk';
import { CommentAsset } from 'enevti-types/chain/engagement';
import { CHAIN_STATE_COMMENT } from '../../../constants/codec';
import { commentSchema } from '../../../schemas/chain/engagement';

export const accessCommentById = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
): Promise<CommentAsset | undefined> => {
  const commentBuffer = await dataAccess.getChainState(`${CHAIN_STATE_COMMENT}:${id}`);
  if (!commentBuffer) {
    return undefined;
  }
  return codec.decode<CommentAsset>(commentSchema, commentBuffer);
};

export const getCommentById = async (
  stateStore: StateStore,
  id: string,
): Promise<CommentAsset | undefined> => {
  const commentBuffer = await stateStore.chain.get(`${CHAIN_STATE_COMMENT}:${id}`);
  if (!commentBuffer) {
    return undefined;
  }
  return codec.decode<CommentAsset>(commentSchema, commentBuffer);
};

export const setCommentById = async (stateStore: StateStore, id: string, comment: CommentAsset) => {
  await stateStore.chain.set(`${CHAIN_STATE_COMMENT}:${id}`, codec.encode(commentSchema, comment));
};
