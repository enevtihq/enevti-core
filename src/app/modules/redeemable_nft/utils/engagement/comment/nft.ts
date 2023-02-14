import { BaseModuleDataAccess, StateStore } from 'lisk-framework';
import { codec } from 'lisk-sdk';
import { CommentAtAsset, CommentAsset } from 'enevti-types/chain/engagement';
import { CHAIN_STATE_COMMENT } from '../../../constants/codec';
import { commentAtSchema } from '../../../schemas/chain/engagement';
import { getCommentById, setCommentById } from './comment';

export const accessNFTCommentById = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
): Promise<CommentAtAsset> => {
  const commentNftBuffer = await dataAccess.getChainState(`${CHAIN_STATE_COMMENT}:nft:${id}`);
  if (!commentNftBuffer) {
    return { comment: [] };
  }
  return codec.decode<CommentAtAsset>(commentAtSchema, commentNftBuffer);
};

export const getNFTCommentById = async (
  stateStore: StateStore,
  id: string,
): Promise<CommentAtAsset> => {
  const commentNftBuffer = await stateStore.chain.get(`${CHAIN_STATE_COMMENT}:nft:${id}`);
  if (!commentNftBuffer) {
    return { comment: [] };
  }
  return codec.decode<CommentAtAsset>(commentAtSchema, commentNftBuffer);
};

export const setNFTCommentById = async (
  stateStore: StateStore,
  id: string,
  comment: CommentAtAsset,
) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_COMMENT}:nft:${id}`,
    codec.encode(commentAtSchema, comment),
  );
};

export const addNFTCommentById = async (
  stateStore: StateStore,
  id: string,
  comment: CommentAsset,
) => {
  const commentNft = await getNFTCommentById(stateStore, id);
  if (!commentNft) {
    await setNFTCommentById(stateStore, id, { comment: [comment.id] });
    return;
  }

  commentNft.comment.unshift(comment.id);
  await setNFTCommentById(stateStore, id, commentNft);

  const commentBuffer = await getCommentById(stateStore, comment.id.toString('hex'));
  if (!commentBuffer) {
    await setCommentById(stateStore, comment.id.toString('hex'), comment);
  } else {
    throw Error('Comment already exist');
  }
};
