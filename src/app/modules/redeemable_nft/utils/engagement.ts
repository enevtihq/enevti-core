import { BaseModuleDataAccess } from 'lisk-framework';
import { codec, StateStore } from 'lisk-sdk';
import {
  AllCommentAsset,
  AllLikeAsset,
  CommentAsset,
} from '../../../../types/core/chain/engagement';
import {
  CHAIN_STATE_COMMENT_COLLECTION,
  CHAIN_STATE_COMMENT_NFT,
  CHAIN_STATE_LIKE_COLLECTION,
  CHAIN_STATE_LIKE_NFT,
} from '../constants/codec';
import { commentSchema, likeSchema } from '../schemas/chain/engagement';

export const accessNFTLikeById = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
): Promise<AllLikeAsset | undefined> => {
  const likeNftBuffer = await dataAccess.getChainState(`${CHAIN_STATE_LIKE_NFT}:${id}`);
  if (!likeNftBuffer) {
    return undefined;
  }
  return codec.decode<AllLikeAsset>(likeSchema, likeNftBuffer);
};

export const getNFTLikeById = async (
  stateStore: StateStore,
  id: string,
): Promise<AllLikeAsset | undefined> => {
  const likeNftBuffer = await stateStore.chain.get(`${CHAIN_STATE_LIKE_NFT}:${id}`);
  if (!likeNftBuffer) {
    return undefined;
  }
  return codec.decode<AllLikeAsset>(likeSchema, likeNftBuffer);
};

export const setNFTLikeById = async (stateStore: StateStore, id: string, like: AllLikeAsset) => {
  await stateStore.chain.set(`${CHAIN_STATE_LIKE_NFT}:${id}`, codec.encode(likeSchema, like));
};

export const addNFTLikeById = async (stateStore: StateStore, id: string, address: Buffer) => {
  const likeNft = await getNFTLikeById(stateStore, id);
  if (!likeNft) {
    await setNFTLikeById(stateStore, id, { address: [address] });
    return;
  }

  if (likeNft.address.findIndex(t => Buffer.compare(address, t) === 0) === -1) {
    likeNft.address.unshift(address);
    await setNFTLikeById(stateStore, id, likeNft);
  } else {
    throw Error('Address already exist');
  }
};

export const accessCollectionLikeById = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
): Promise<AllLikeAsset | undefined> => {
  const likeCollectionBuffer = await dataAccess.getChainState(
    `${CHAIN_STATE_LIKE_COLLECTION}:${id}`,
  );
  if (!likeCollectionBuffer) {
    return undefined;
  }
  return codec.decode<AllLikeAsset>(likeSchema, likeCollectionBuffer);
};

export const getCollectionLikeById = async (
  stateStore: StateStore,
  id: string,
): Promise<AllLikeAsset | undefined> => {
  const likeCollectionBuffer = await stateStore.chain.get(`${CHAIN_STATE_LIKE_COLLECTION}:${id}`);
  if (!likeCollectionBuffer) {
    return undefined;
  }
  return codec.decode<AllLikeAsset>(likeSchema, likeCollectionBuffer);
};

export const setCollectionLikeById = async (
  stateStore: StateStore,
  id: string,
  like: AllLikeAsset,
) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_LIKE_COLLECTION}:${id}`,
    codec.encode(likeSchema, like),
  );
};

export const addCollectionLikeById = async (
  stateStore: StateStore,
  id: string,
  address: Buffer,
) => {
  const likeCollection = await getCollectionLikeById(stateStore, id);
  if (!likeCollection) {
    await setCollectionLikeById(stateStore, id, { address: [address] });
    return;
  }

  if (likeCollection.address.findIndex(t => Buffer.compare(address, t) === 0) === -1) {
    likeCollection.address.unshift(address);
    await setCollectionLikeById(stateStore, id, likeCollection);
  } else {
    throw Error('Address already exist');
  }
};

export const accessNFTCommentById = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
): Promise<AllCommentAsset | undefined> => {
  const commentNftBuffer = await dataAccess.getChainState(`${CHAIN_STATE_COMMENT_NFT}:${id}`);
  if (!commentNftBuffer) {
    return undefined;
  }
  return codec.decode<AllCommentAsset>(commentSchema, commentNftBuffer);
};

export const getNFTCommentById = async (
  stateStore: StateStore,
  id: string,
): Promise<AllCommentAsset | undefined> => {
  const commentNftBuffer = await stateStore.chain.get(`${CHAIN_STATE_COMMENT_NFT}:${id}`);
  if (!commentNftBuffer) {
    return undefined;
  }
  return codec.decode<AllCommentAsset>(commentSchema, commentNftBuffer);
};

export const setNFTCommentById = async (
  stateStore: StateStore,
  id: string,
  comment: AllCommentAsset,
) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_COMMENT_NFT}:${id}`,
    codec.encode(commentSchema, comment),
  );
};

export const addNFTCommentById = async (
  stateStore: StateStore,
  id: string,
  comment: CommentAsset,
) => {
  const commentNft = await getNFTCommentById(stateStore, id);
  if (!commentNft) {
    await setNFTCommentById(stateStore, id, { comment: [comment] });
    return;
  }

  commentNft.comment.unshift(comment);
  await setNFTCommentById(stateStore, id, commentNft);
};

export const accessCollectionCommentById = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
): Promise<AllCommentAsset | undefined> => {
  const commentCollectionBuffer = await dataAccess.getChainState(
    `${CHAIN_STATE_COMMENT_COLLECTION}:${id}`,
  );
  if (!commentCollectionBuffer) {
    return undefined;
  }
  return codec.decode<AllCommentAsset>(commentSchema, commentCollectionBuffer);
};

export const getCollectionCommentById = async (
  stateStore: StateStore,
  id: string,
): Promise<AllCommentAsset | undefined> => {
  const commentCollectionBuffer = await stateStore.chain.get(
    `${CHAIN_STATE_COMMENT_COLLECTION}:${id}`,
  );
  if (!commentCollectionBuffer) {
    return undefined;
  }
  return codec.decode<AllCommentAsset>(commentSchema, commentCollectionBuffer);
};

export const setCollectionCommentById = async (
  stateStore: StateStore,
  id: string,
  comment: AllCommentAsset,
) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_COMMENT_COLLECTION}:${id}`,
    codec.encode(commentSchema, comment),
  );
};

export const addCollectionCommentById = async (
  stateStore: StateStore,
  id: string,
  comment: CommentAsset,
) => {
  const commentCollection = await getCollectionCommentById(stateStore, id);
  if (!commentCollection) {
    await setCollectionCommentById(stateStore, id, { comment: [comment] });
    return;
  }

  commentCollection.comment.unshift(comment);
  await setCollectionCommentById(stateStore, id, commentCollection);
};
