import { BaseModuleDataAccess } from 'lisk-framework';
import { codec, StateStore } from 'lisk-sdk';
import {
  CommentAtAsset,
  LikeAtAsset,
  CommentAsset,
  LikedAsset,
  ReplyAsset,
  ReplyAtAsset,
  CommentClubsAsset,
  CommentClubsAtAsset,
} from '../../../../types/core/chain/engagement';
import {
  CHAIN_STATE_COMMENT,
  CHAIN_STATE_COMMENT_CLUBS,
  CHAIN_STATE_LIKE,
  CHAIN_STATE_LIKED,
  CHAIN_STATE_REPLY,
  CHAIN_STATE_REPLY_CLUBS,
} from '../constants/codec';
import {
  commentAtSchema,
  commentClubsAtSchema,
  commentClubsSchema,
  commentSchema,
  likeAtSchema,
  likedAtSchema,
  replyAtSchema,
  replySchema,
} from '../schemas/chain/engagement';

export const accessLiked = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
  address: string,
): Promise<0 | 1> => {
  const likedBuffer = await dataAccess.getChainState(`${CHAIN_STATE_LIKED}:${id}:${address}`);
  if (!likedBuffer) {
    return 0;
  }
  return codec.decode<LikedAsset>(likedAtSchema, likedBuffer).status;
};

export const getLiked = async (
  stateStore: StateStore,
  id: string,
  address: string,
): Promise<0 | 1> => {
  const likedBuffer = await stateStore.chain.get(`${CHAIN_STATE_LIKED}:${id}:${address}`);
  if (!likedBuffer) {
    return 0;
  }
  return codec.decode<LikedAsset>(likedAtSchema, likedBuffer).status;
};

export const setLiked = async (
  stateStore: StateStore,
  id: string,
  address: string,
  status: 0 | 1,
) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_LIKED}:${id}:${address}`,
    codec.encode(likedAtSchema, { status }),
  );
};

export const accessNFTLikeById = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
): Promise<LikeAtAsset> => {
  const likeNftBuffer = await dataAccess.getChainState(`${CHAIN_STATE_LIKE}:nft:${id}`);
  if (!likeNftBuffer) {
    return { address: [] };
  }
  return codec.decode<LikeAtAsset>(likeAtSchema, likeNftBuffer);
};

export const getNFTLikeById = async (stateStore: StateStore, id: string): Promise<LikeAtAsset> => {
  const likeNftBuffer = await stateStore.chain.get(`${CHAIN_STATE_LIKE}:nft:${id}`);
  if (!likeNftBuffer) {
    return { address: [] };
  }
  return codec.decode<LikeAtAsset>(likeAtSchema, likeNftBuffer);
};

export const setNFTLikeById = async (stateStore: StateStore, id: string, like: LikeAtAsset) => {
  await stateStore.chain.set(`${CHAIN_STATE_LIKE}:nft:${id}`, codec.encode(likeAtSchema, like));
};

export const addNFTLikeById = async (stateStore: StateStore, id: string, address: Buffer) => {
  const likeNft = await getNFTLikeById(stateStore, id);
  if (!likeNft) {
    await setNFTLikeById(stateStore, id, { address: [address] });
    await setLiked(stateStore, id, address.toString('hex'), 1);
    return;
  }

  const liked = await getLiked(stateStore, id, address.toString('hex'));
  if (liked === 0) {
    likeNft.address.unshift(address);
    await setNFTLikeById(stateStore, id, likeNft);
    await setLiked(stateStore, id, address.toString('hex'), 1);
  } else {
    throw Error('Address already exist');
  }
};

export const accessCollectionLikeById = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
): Promise<LikeAtAsset> => {
  const likeCollectionBuffer = await dataAccess.getChainState(
    `${CHAIN_STATE_LIKE}:collection:${id}`,
  );
  if (!likeCollectionBuffer) {
    return { address: [] };
  }
  return codec.decode<LikeAtAsset>(likeAtSchema, likeCollectionBuffer);
};

export const getCollectionLikeById = async (
  stateStore: StateStore,
  id: string,
): Promise<LikeAtAsset> => {
  const likeCollectionBuffer = await stateStore.chain.get(`${CHAIN_STATE_LIKE}:collection:${id}`);
  if (!likeCollectionBuffer) {
    return { address: [] };
  }
  return codec.decode<LikeAtAsset>(likeAtSchema, likeCollectionBuffer);
};

export const setCollectionLikeById = async (
  stateStore: StateStore,
  id: string,
  like: LikeAtAsset,
) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_LIKE}:collection:${id}`,
    codec.encode(likeAtSchema, like),
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
    await setLiked(stateStore, id, address.toString('hex'), 1);
    return;
  }

  const liked = await getLiked(stateStore, id, address.toString('hex'));
  if (liked === 0) {
    likeCollection.address.unshift(address);
    await setCollectionLikeById(stateStore, id, likeCollection);
    await setLiked(stateStore, id, address.toString('hex'), 1);
  } else {
    throw Error('Address already exist');
  }
};

export const accessCommentLikeById = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
): Promise<LikeAtAsset> => {
  const likeCommentBuffer = await dataAccess.getChainState(`${CHAIN_STATE_LIKE}:comment:${id}`);
  if (!likeCommentBuffer) {
    return { address: [] };
  }
  return codec.decode<LikeAtAsset>(likeAtSchema, likeCommentBuffer);
};

export const getCommentLikeById = async (
  stateStore: StateStore,
  id: string,
): Promise<LikeAtAsset> => {
  const likeCommentBuffer = await stateStore.chain.get(`${CHAIN_STATE_LIKE}:comment:${id}`);
  if (!likeCommentBuffer) {
    return { address: [] };
  }
  return codec.decode<LikeAtAsset>(likeAtSchema, likeCommentBuffer);
};

export const setCommentLikeById = async (stateStore: StateStore, id: string, like: LikeAtAsset) => {
  await stateStore.chain.set(`${CHAIN_STATE_LIKE}:comment:${id}`, codec.encode(likeAtSchema, like));
};

export const addCommentLikeById = async (stateStore: StateStore, id: string, address: Buffer) => {
  const likeComment = await getCommentLikeById(stateStore, id);
  if (!likeComment) {
    await setCommentLikeById(stateStore, id, { address: [address] });
    await setLiked(stateStore, id, address.toString('hex'), 1);
    return;
  }

  const liked = await getLiked(stateStore, id, address.toString('hex'));
  if (liked === 0) {
    likeComment.address.unshift(address);
    await setCommentLikeById(stateStore, id, likeComment);
    await setLiked(stateStore, id, address.toString('hex'), 1);
  } else {
    throw Error('Address already exist');
  }
};

export const accessReplyLikeById = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
): Promise<LikeAtAsset> => {
  const likeReplyBuffer = await dataAccess.getChainState(`${CHAIN_STATE_LIKE}:reply:${id}`);
  if (!likeReplyBuffer) {
    return { address: [] };
  }
  return codec.decode<LikeAtAsset>(likeAtSchema, likeReplyBuffer);
};

export const getReplyLikeById = async (
  stateStore: StateStore,
  id: string,
): Promise<LikeAtAsset> => {
  const likeReplyBuffer = await stateStore.chain.get(`${CHAIN_STATE_LIKE}:reply:${id}`);
  if (!likeReplyBuffer) {
    return { address: [] };
  }
  return codec.decode<LikeAtAsset>(likeAtSchema, likeReplyBuffer);
};

export const setReplyLikeById = async (stateStore: StateStore, id: string, like: LikeAtAsset) => {
  await stateStore.chain.set(`${CHAIN_STATE_LIKE}:reply:${id}`, codec.encode(likeAtSchema, like));
};

export const addReplyLikeById = async (stateStore: StateStore, id: string, address: Buffer) => {
  const likeReply = await getReplyLikeById(stateStore, id);
  if (!likeReply) {
    await setReplyLikeById(stateStore, id, { address: [address] });
    await setLiked(stateStore, id, address.toString('hex'), 1);
    return;
  }

  const liked = await getLiked(stateStore, id, address.toString('hex'));
  if (liked === 0) {
    likeReply.address.unshift(address);
    await setReplyLikeById(stateStore, id, likeReply);
    await setLiked(stateStore, id, address.toString('hex'), 1);
  } else {
    throw Error('Address already exist');
  }
};

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

export const accessReplyById = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
): Promise<ReplyAsset | undefined> => {
  const replyBuffer = await dataAccess.getChainState(`${CHAIN_STATE_REPLY}:${id}`);
  if (!replyBuffer) {
    return undefined;
  }
  return codec.decode<ReplyAsset>(replySchema, replyBuffer);
};

export const getReplyById = async (
  stateStore: StateStore,
  id: string,
): Promise<ReplyAsset | undefined> => {
  const replyBuffer = await stateStore.chain.get(`${CHAIN_STATE_REPLY}:${id}`);
  if (!replyBuffer) {
    return undefined;
  }
  return codec.decode<ReplyAsset>(replySchema, replyBuffer);
};

export const setReplyById = async (stateStore: StateStore, id: string, reply: ReplyAsset) => {
  await stateStore.chain.set(`${CHAIN_STATE_REPLY}:${id}`, codec.encode(replySchema, reply));
};

export const accessCommentReplyById = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
): Promise<ReplyAtAsset> => {
  const commentReplyBuffer = await dataAccess.getChainState(`${CHAIN_STATE_REPLY}:comment:${id}`);
  if (!commentReplyBuffer) {
    return { reply: [] };
  }
  return codec.decode<ReplyAtAsset>(replyAtSchema, commentReplyBuffer);
};

export const getCommentReplyById = async (
  stateStore: StateStore,
  id: string,
): Promise<ReplyAtAsset> => {
  const commentReplyBuffer = await stateStore.chain.get(`${CHAIN_STATE_REPLY}:comment:${id}`);
  if (!commentReplyBuffer) {
    return { reply: [] };
  }
  return codec.decode<ReplyAtAsset>(replyAtSchema, commentReplyBuffer);
};

export const setCommentReplyById = async (
  stateStore: StateStore,
  id: string,
  reply: ReplyAtAsset,
) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_REPLY}:comment:${id}`,
    codec.encode(replyAtSchema, reply),
  );
};

export const addCommentReplyById = async (
  stateStore: StateStore,
  id: string,
  reply: ReplyAsset,
) => {
  const commentReply = await getCommentReplyById(stateStore, id);
  if (!commentReply) {
    await setCommentReplyById(stateStore, id, { reply: [reply.id] });
    return;
  }

  commentReply.reply.push(reply.id);
  await setCommentReplyById(stateStore, id, commentReply);

  const replyBuffer = await getReplyById(stateStore, reply.id.toString('hex'));
  if (!replyBuffer) {
    await setReplyById(stateStore, reply.id.toString('hex'), reply);
  } else {
    throw Error('Reply already exist');
  }
};

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

export const accessReplyClubsById = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
): Promise<ReplyAsset | undefined> => {
  const replyBuffer = await dataAccess.getChainState(`${CHAIN_STATE_REPLY_CLUBS}:${id}`);
  if (!replyBuffer) {
    return undefined;
  }
  return codec.decode<ReplyAsset>(replySchema, replyBuffer);
};

export const getReplyClubsById = async (
  stateStore: StateStore,
  id: string,
): Promise<ReplyAsset | undefined> => {
  const replyBuffer = await stateStore.chain.get(`${CHAIN_STATE_REPLY_CLUBS}:${id}`);
  if (!replyBuffer) {
    return undefined;
  }
  return codec.decode<ReplyAsset>(replySchema, replyBuffer);
};

export const setReplyClubsById = async (stateStore: StateStore, id: string, reply: ReplyAsset) => {
  await stateStore.chain.set(`${CHAIN_STATE_REPLY_CLUBS}:${id}`, codec.encode(replySchema, reply));
};

export const accessCommentClubsReplyById = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
): Promise<ReplyAtAsset> => {
  const commentReplyBuffer = await dataAccess.getChainState(
    `${CHAIN_STATE_REPLY_CLUBS}:comment:${id}`,
  );
  if (!commentReplyBuffer) {
    return { reply: [] };
  }
  return codec.decode<ReplyAtAsset>(replyAtSchema, commentReplyBuffer);
};

export const getCommentClubsReplyById = async (
  stateStore: StateStore,
  id: string,
): Promise<ReplyAtAsset> => {
  const commentReplyBuffer = await stateStore.chain.get(`${CHAIN_STATE_REPLY_CLUBS}:comment:${id}`);
  if (!commentReplyBuffer) {
    return { reply: [] };
  }
  return codec.decode<ReplyAtAsset>(replyAtSchema, commentReplyBuffer);
};

export const setCommentClubsReplyById = async (
  stateStore: StateStore,
  id: string,
  reply: ReplyAtAsset,
) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_REPLY_CLUBS}:comment:${id}`,
    codec.encode(replyAtSchema, reply),
  );
};

export const addCommentClubsReplyById = async (
  stateStore: StateStore,
  id: string,
  reply: ReplyAsset,
) => {
  const commentReply = await getCommentClubsReplyById(stateStore, id);
  if (!commentReply) {
    await setCommentClubsReplyById(stateStore, id, { reply: [reply.id] });
    return;
  }

  commentReply.reply.push(reply.id);
  await setCommentClubsReplyById(stateStore, id, commentReply);

  const replyBuffer = await getReplyClubsById(stateStore, reply.id.toString('hex'));
  if (!replyBuffer) {
    await setReplyClubsById(stateStore, reply.id.toString('hex'), reply);
  } else {
    throw Error('Reply already exist');
  }
};

export const accessCommentClubsLikeById = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
): Promise<LikeAtAsset> => {
  const likeCommentBuffer = await dataAccess.getChainState(
    `${CHAIN_STATE_LIKE}:commentClubs:${id}`,
  );
  if (!likeCommentBuffer) {
    return { address: [] };
  }
  return codec.decode<LikeAtAsset>(likeAtSchema, likeCommentBuffer);
};

export const getCommentClubsLikeById = async (
  stateStore: StateStore,
  id: string,
): Promise<LikeAtAsset> => {
  const likeCommentBuffer = await stateStore.chain.get(`${CHAIN_STATE_LIKE}:commentClubs:${id}`);
  if (!likeCommentBuffer) {
    return { address: [] };
  }
  return codec.decode<LikeAtAsset>(likeAtSchema, likeCommentBuffer);
};

export const setCommentClubsLikeById = async (
  stateStore: StateStore,
  id: string,
  like: LikeAtAsset,
) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_LIKE}:commentClubs:${id}`,
    codec.encode(likeAtSchema, like),
  );
};

export const addCommentClubsLikeById = async (
  stateStore: StateStore,
  id: string,
  address: Buffer,
) => {
  const likeComment = await getCommentClubsLikeById(stateStore, id);
  if (!likeComment) {
    await setCommentClubsLikeById(stateStore, id, { address: [address] });
    await setLiked(stateStore, id, address.toString('hex'), 1);
    return;
  }

  const liked = await getLiked(stateStore, id, address.toString('hex'));
  if (liked === 0) {
    likeComment.address.unshift(address);
    await setCommentClubsLikeById(stateStore, id, likeComment);
    await setLiked(stateStore, id, address.toString('hex'), 1);
  } else {
    throw Error('Address already exist');
  }
};

export const accessReplyClubsLikeById = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
): Promise<LikeAtAsset> => {
  const likeReplyBuffer = await dataAccess.getChainState(`${CHAIN_STATE_LIKE}:replyClubs:${id}`);
  if (!likeReplyBuffer) {
    return { address: [] };
  }
  return codec.decode<LikeAtAsset>(likeAtSchema, likeReplyBuffer);
};

export const getReplyClubsLikeById = async (
  stateStore: StateStore,
  id: string,
): Promise<LikeAtAsset> => {
  const likeReplyBuffer = await stateStore.chain.get(`${CHAIN_STATE_LIKE}:replyClubs:${id}`);
  if (!likeReplyBuffer) {
    return { address: [] };
  }
  return codec.decode<LikeAtAsset>(likeAtSchema, likeReplyBuffer);
};

export const setReplyClubsLikeById = async (
  stateStore: StateStore,
  id: string,
  like: LikeAtAsset,
) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_LIKE}:replyClubs:${id}`,
    codec.encode(likeAtSchema, like),
  );
};

export const addReplyClubsLikeById = async (
  stateStore: StateStore,
  id: string,
  address: Buffer,
) => {
  const likeReply = await getReplyClubsLikeById(stateStore, id);
  if (!likeReply) {
    await setReplyClubsLikeById(stateStore, id, { address: [address] });
    await setLiked(stateStore, id, address.toString('hex'), 1);
    return;
  }

  const liked = await getLiked(stateStore, id, address.toString('hex'));
  if (liked === 0) {
    likeReply.address.unshift(address);
    await setReplyClubsLikeById(stateStore, id, likeReply);
    await setLiked(stateStore, id, address.toString('hex'), 1);
  } else {
    throw Error('Address already exist');
  }
};
