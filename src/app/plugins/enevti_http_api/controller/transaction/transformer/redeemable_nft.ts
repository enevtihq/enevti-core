import {
  CommentCollectionUI,
  CommentCollectionProps,
} from 'enevti-types/asset/redeemable_nft/comment_collection_asset';
import {
  CommentCollectionClubsProps,
  CommentCollectionClubsUI,
} from 'enevti-types/asset/redeemable_nft/comment_collection_clubs_asset';
import {
  CommentMomentProps,
  CommentMomentUI,
} from 'enevti-types/asset/redeemable_nft/comment_moment_asset';
import {
  CommentMomentClubsProps,
  CommentMomentClubsUI,
} from 'enevti-types/asset/redeemable_nft/comment_moment_clubs_asset';
import { CommentNFTUI, CommentNFTProps } from 'enevti-types/asset/redeemable_nft/comment_nft_asset';
import {
  CommentNFTClubsProps,
  CommentNFTClubsUI,
} from 'enevti-types/asset/redeemable_nft/comment_nft_clubs_asset';
import {
  CreateOneKindNFTUI,
  CreateOneKindNFTProps,
} from 'enevti-types/asset/redeemable_nft/create_onekind_nft_asset';
import {
  DeliverSecretUI,
  DeliverSecretProps,
} from 'enevti-types/asset/redeemable_nft/deliver_secret_asset';
import {
  LikeCollectionUI,
  LikeCollectionProps,
} from 'enevti-types/asset/redeemable_nft/like_collection_asset';
import {
  LikeCommentUI,
  LikeCommentProps,
} from 'enevti-types/asset/redeemable_nft/like_comment_asset';
import {
  LikeCommentClubsProps,
  LikeCommentClubsUI,
} from 'enevti-types/asset/redeemable_nft/like_comment_clubs_asset';
import { LikeMomentProps, LikeMomentUI } from 'enevti-types/asset/redeemable_nft/like_moment_asset';
import { LikeNFTUI, LikeNFTProps } from 'enevti-types/asset/redeemable_nft/like_nft_asset';
import { LikeReplyUI, LikeReplyProps } from 'enevti-types/asset/redeemable_nft/like_reply_asset';
import {
  LikeReplyClubsProps,
  LikeReplyClubsUI,
} from 'enevti-types/asset/redeemable_nft/like_reply_clubs_asset';
import { MintMomentUI, MintMomentProps } from 'enevti-types/asset/redeemable_nft/mint_moment_asset';
import { MintNFTUI, MintNFTProps } from 'enevti-types/asset/redeemable_nft/mint_nft_asset';
import {
  MintNFTByQRUI,
  MintNFTByQRProps,
} from 'enevti-types/asset/redeemable_nft/mint_nft_type_qr_asset';
import {
  ReplyCommentUI,
  ReplyCommentProps,
} from 'enevti-types/asset/redeemable_nft/reply_comment_asset';
import {
  ReplyCommentClubsProps,
  ReplyCommentClubsUI,
} from 'enevti-types/asset/redeemable_nft/reply_comment_clubs_asset';
import {
  SetVideoCallAnsweredProps,
  SetVideoCallAnsweredUI,
} from 'enevti-types/asset/redeemable_nft/set_video_call_answered_asset';
import {
  SetVideoCallRejectedProps,
  SetVideoCallRejectedUI,
} from 'enevti-types/asset/redeemable_nft/set_video_call_rejected_asset';
import { AppTransaction } from 'enevti-types/service/transaction';

export function createOneKindNFT(
  payload: AppTransaction<CreateOneKindNFTUI>,
): AppTransaction<CreateOneKindNFTProps> {
  return {
    ...payload,
    asset: {
      ...payload.asset,
      price: {
        amount: BigInt(payload.asset.price.amount),
        currency: payload.asset.price.currency,
      },
    },
  };
}

export function mintNFT(payload: AppTransaction<MintNFTUI>): AppTransaction<MintNFTProps> {
  return payload;
}

export function mintNFTQR(
  payload: AppTransaction<MintNFTByQRUI>,
): AppTransaction<MintNFTByQRProps> {
  return payload;
}

export function deliverSecret(
  payload: AppTransaction<DeliverSecretUI>,
): AppTransaction<DeliverSecretProps> {
  return payload;
}

export function likeNFT(payload: AppTransaction<LikeNFTUI>): AppTransaction<LikeNFTProps> {
  return payload;
}

export function likeCollection(
  payload: AppTransaction<LikeCollectionUI>,
): AppTransaction<LikeCollectionProps> {
  return payload;
}

export function likeComment(
  payload: AppTransaction<LikeCommentUI>,
): AppTransaction<LikeCommentProps> {
  return payload;
}

export function likeReply(payload: AppTransaction<LikeReplyUI>): AppTransaction<LikeReplyProps> {
  return payload;
}

export function replyComment(
  payload: AppTransaction<ReplyCommentUI>,
): AppTransaction<ReplyCommentProps> {
  return payload;
}

export function commentNFT(payload: AppTransaction<CommentNFTUI>): AppTransaction<CommentNFTProps> {
  return payload;
}

export function commentCollection(
  payload: AppTransaction<CommentCollectionUI>,
): AppTransaction<CommentCollectionProps> {
  return payload;
}

export function commentCollectionClubs(
  payload: AppTransaction<CommentCollectionClubsUI>,
): AppTransaction<CommentCollectionClubsProps> {
  return payload;
}

export function commentNFTClubs(
  payload: AppTransaction<CommentNFTClubsUI>,
): AppTransaction<CommentNFTClubsProps> {
  return payload;
}

export function replyCommentClubs(
  payload: AppTransaction<ReplyCommentClubsUI>,
): AppTransaction<ReplyCommentClubsProps> {
  return payload;
}

export function likeReplyClubs(
  payload: AppTransaction<LikeReplyClubsUI>,
): AppTransaction<LikeReplyClubsProps> {
  return payload;
}

export function likeCommentClubs(
  payload: AppTransaction<LikeCommentClubsUI>,
): AppTransaction<LikeCommentClubsProps> {
  return payload;
}

export function setVideoCallRejected(
  payload: AppTransaction<SetVideoCallRejectedUI>,
): AppTransaction<SetVideoCallRejectedProps> {
  return payload;
}

export function setVideoCallAnswered(
  payload: AppTransaction<SetVideoCallAnsweredUI>,
): AppTransaction<SetVideoCallAnsweredProps> {
  return payload;
}

export function mintMoment(payload: AppTransaction<MintMomentUI>): AppTransaction<MintMomentProps> {
  return payload;
}

export function commentMoment(
  payload: AppTransaction<CommentMomentUI>,
): AppTransaction<CommentMomentProps> {
  return payload;
}

export function commentMomentClubs(
  payload: AppTransaction<CommentMomentClubsUI>,
): AppTransaction<CommentMomentClubsProps> {
  return payload;
}

export function likeMoment(payload: AppTransaction<LikeMomentUI>): AppTransaction<LikeMomentProps> {
  return payload;
}
