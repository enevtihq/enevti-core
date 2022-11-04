import clubs from './clubs';
import comment from './comment';
import like from './like';
import reply from './reply';

export const {
  accessCollectionCommentClubsById,
  accessCommentClubsById,
  accessNftCommentClubsById,
  addCollectionCommentClubsById,
  addNftCommentClubsById,
  getCollectionCommentClubsById,
  getCommentClubsById,
  getNftCommentClubsById,
  setCollectionCommentClubsById,
  setCommentClubsById,
  setNftCommentClubsById,
} = clubs;

export const {
  accessCollectionCommentById,
  accessCommentById,
  accessNFTCommentById,
  addCollectionCommentById,
  addNFTCommentById,
  getCollectionCommentById,
  getCommentById,
  getNFTCommentById,
  setCollectionCommentById,
  setCommentById,
  setNFTCommentById,
  accessMomentCommentById,
  addMomentCommentById,
  getMomentCommentById,
  setMomentCommentById,
} = comment;

export const {
  accessCollectionLikeById,
  accessCommentClubsLikeById,
  accessCommentLikeById,
  accessLiked,
  accessNFTLikeById,
  accessReplyClubsLikeById,
  accessReplyLikeById,
  addCollectionLikeById,
  addCommentClubsLikeById,
  addCommentLikeById,
  addNFTLikeById,
  addReplyClubsLikeById,
  addReplyLikeById,
  getCollectionLikeById,
  getCommentClubsLikeById,
  getCommentLikeById,
  getLiked,
  getNFTLikeById,
  getReplyClubsLikeById,
  getReplyLikeById,
  setCollectionLikeById,
  setCommentClubsLikeById,
  setCommentLikeById,
  setLiked,
  setNFTLikeById,
  setReplyClubsLikeById,
  setReplyLikeById,
} = like;

export const {
  accessCommentClubsReplyById,
  accessCommentReplyById,
  accessReplyById,
  accessReplyClubsById,
  addCommentClubsReplyById,
  addCommentReplyById,
  getCommentClubsReplyById,
  getCommentReplyById,
  getReplyById,
  getReplyClubsById,
  setCommentClubsReplyById,
  setCommentReplyById,
  setReplyById,
  setReplyClubsById,
} = reply;
