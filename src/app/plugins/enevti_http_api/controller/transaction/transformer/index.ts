import * as token from './token';
import * as dpos from './dpos';
import * as redeemableNft from './redeemable_nft';

import { AddStakeUI } from 'enevti-types/asset/chain/add_stake_asset';
import { RegisterUsernameUI } from 'enevti-types/asset/chain/register_username';
import { CommentCollectionUI } from 'enevti-types/asset/redeemable_nft/comment_collection_asset';
import { CommentNFTUI } from 'enevti-types/asset/redeemable_nft/comment_nft_asset';
import { CreateOneKindNFTUI } from 'enevti-types/asset/redeemable_nft/create_onekind_nft_asset';
import { DeliverSecretUI } from 'enevti-types/asset/redeemable_nft/deliver_secret_asset';
import { LikeCollectionUI } from 'enevti-types/asset/redeemable_nft/like_collection_asset';
import { LikeCommentUI } from 'enevti-types/asset/redeemable_nft/like_comment_asset';
import { LikeNFTUI } from 'enevti-types/asset/redeemable_nft/like_nft_asset';
import { LikeReplyUI } from 'enevti-types/asset/redeemable_nft/like_reply_asset';
import { MintNFTUI } from 'enevti-types/asset/redeemable_nft/mint_nft_asset';
import { MintNFTByQRUI } from 'enevti-types/asset/redeemable_nft/mint_nft_type_qr_asset';
import { ReplyCommentUI } from 'enevti-types/asset/redeemable_nft/reply_comment_asset';
import { TransferTokenUI } from 'enevti-types/asset/token/transfer_asset';
import { AppTransaction } from 'enevti-types/service/transaction';
import { CommentCollectionClubsUI } from 'enevti-types/asset/redeemable_nft/comment_collection_clubs_asset';
import { CommentNFTClubsUI } from 'enevti-types/asset/redeemable_nft/comment_nft_clubs_asset';
import { ReplyCommentClubsUI } from 'enevti-types/asset/redeemable_nft/reply_comment_clubs_asset';
import { LikeReplyClubsUI } from 'enevti-types/asset/redeemable_nft/like_reply_clubs_asset';
import { LikeCommentClubsUI } from 'enevti-types/asset/redeemable_nft/like_comment_clubs_asset';
import { SetVideoCallRejectedUI } from 'enevti-types/asset/redeemable_nft/set_video_call_rejected_asset';
import { SetVideoCallAnsweredUI } from 'enevti-types/asset/redeemable_nft/set_video_call_answered_asset';
import { MintMomentUI } from 'enevti-types/asset/redeemable_nft/mint_moment_asset';
import { CommentMomentUI } from 'enevti-types/asset/redeemable_nft/comment_moment_asset';
import { CommentMomentClubsUI } from 'enevti-types/asset/redeemable_nft/comment_moment_clubs_asset';
import { LikeMomentUI } from 'enevti-types/asset/redeemable_nft/like_moment_asset';

export default function transformAsset(payload: Record<string, unknown>) {
  switch (payload.moduleID) {
    case 2:
      switch (payload.assetID) {
        case 0:
          return token.transferToken((payload as unknown) as AppTransaction<TransferTokenUI>);
        default:
          return payload;
      }
    case 5:
      switch (payload.assetID) {
        case 0:
          return dpos.registerDelegate((payload as unknown) as AppTransaction<RegisterUsernameUI>);
        case 1:
          return dpos.voteDelegate((payload as unknown) as AppTransaction<AddStakeUI>);
        default:
          return payload;
      }
    case 1000:
      switch (payload.assetID) {
        case 0:
          return redeemableNft.createOneKindNFT(
            (payload as unknown) as AppTransaction<CreateOneKindNFTUI>,
          );
        case 1:
          return redeemableNft.mintNFT((payload as unknown) as AppTransaction<MintNFTUI>);
        case 2:
          return redeemableNft.deliverSecret(
            (payload as unknown) as AppTransaction<DeliverSecretUI>,
          );
        case 3:
          return redeemableNft.mintNFTQR((payload as unknown) as AppTransaction<MintNFTByQRUI>);
        case 4:
          return redeemableNft.likeNFT((payload as unknown) as AppTransaction<LikeNFTUI>);
        case 5:
          return redeemableNft.likeCollection(
            (payload as unknown) as AppTransaction<LikeCollectionUI>,
          );
        case 6:
          return redeemableNft.commentNFT((payload as unknown) as AppTransaction<CommentNFTUI>);
        case 7:
          return redeemableNft.commentCollection(
            (payload as unknown) as AppTransaction<CommentCollectionUI>,
          );
        case 8:
          return redeemableNft.likeComment((payload as unknown) as AppTransaction<LikeCommentUI>);
        case 9:
          return redeemableNft.likeReply((payload as unknown) as AppTransaction<LikeReplyUI>);
        case 10:
          return redeemableNft.replyComment((payload as unknown) as AppTransaction<ReplyCommentUI>);
        case 11:
          return redeemableNft.commentCollectionClubs(
            (payload as unknown) as AppTransaction<CommentCollectionClubsUI>,
          );
        case 12:
          return redeemableNft.commentNFTClubs(
            (payload as unknown) as AppTransaction<CommentNFTClubsUI>,
          );
        case 13:
          return redeemableNft.replyCommentClubs(
            (payload as unknown) as AppTransaction<ReplyCommentClubsUI>,
          );
        case 14:
          return redeemableNft.likeReplyClubs(
            (payload as unknown) as AppTransaction<LikeReplyClubsUI>,
          );
        case 15:
          return redeemableNft.likeCommentClubs(
            (payload as unknown) as AppTransaction<LikeCommentClubsUI>,
          );
        case 16:
          return redeemableNft.setVideoCallRejected(
            (payload as unknown) as AppTransaction<SetVideoCallRejectedUI>,
          );
        case 17:
          return redeemableNft.setVideoCallAnswered(
            (payload as unknown) as AppTransaction<SetVideoCallAnsweredUI>,
          );
        case 18:
          return redeemableNft.mintMoment((payload as unknown) as AppTransaction<MintMomentUI>);
        case 19:
          return redeemableNft.commentMoment(
            (payload as unknown) as AppTransaction<CommentMomentUI>,
          );
        case 20:
          return redeemableNft.commentMomentClubs(
            (payload as unknown) as AppTransaction<CommentMomentClubsUI>,
          );
        case 21:
          return redeemableNft.likeMoment((payload as unknown) as AppTransaction<LikeMomentUI>);
        default:
          return payload;
      }
    default:
      return payload;
  }
}
