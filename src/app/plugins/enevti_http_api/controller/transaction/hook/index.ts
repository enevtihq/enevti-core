import { BaseChannel } from 'lisk-framework';
import { CommentCollectionUI } from '../../../../../../types/core/asset/redeemable_nft/comment_collection_asset';
import { CommentCollectionClubsUI } from '../../../../../../types/core/asset/redeemable_nft/comment_collection_clubs_asset';
import { CommentMomentUI } from '../../../../../../types/core/asset/redeemable_nft/comment_moment_asset';
import { CommentMomentClubsUI } from '../../../../../../types/core/asset/redeemable_nft/comment_moment_clubs_asset';
import { CommentNFTUI } from '../../../../../../types/core/asset/redeemable_nft/comment_nft_asset';
import { CommentNFTClubsUI } from '../../../../../../types/core/asset/redeemable_nft/comment_nft_clubs_asset';
import { CreateOneKindNFTUI } from '../../../../../../types/core/asset/redeemable_nft/create_onekind_nft_asset';
import { ReplyCommentUI } from '../../../../../../types/core/asset/redeemable_nft/reply_comment_asset';
import { ReplyCommentClubsUI } from '../../../../../../types/core/asset/redeemable_nft/reply_comment_clubs_asset';
import { AppTransaction } from '../../../../../../types/core/service/transaction';
import { invokeStoreResizedImage } from '../../../../ipfs_image_resized/utils/invoker';
import { invokeSetIPFSTextCache } from '../../../../ipfs_text_cache/utils/invoker';

export async function createOneKindNFTAfterTransaction(
  channel: BaseChannel,
  payload: AppTransaction<CreateOneKindNFTUI>,
) {
  await invokeStoreResizedImage(channel, payload.asset.data);
}

export async function commentAfterTransaction(
  channel: BaseChannel,
  payload: AppTransaction<CommentNFTUI>,
) {
  await invokeSetIPFSTextCache(channel, payload.asset.cid);
}

export async function afterTransactionPosted(
  channel: BaseChannel,
  payload: Record<string, unknown>,
) {
  switch (payload.moduleID) {
    case 1000:
      switch (payload.assetID) {
        case 0:
          await createOneKindNFTAfterTransaction(
            channel,
            (payload as unknown) as AppTransaction<CreateOneKindNFTUI>,
          );
          break;
        case 6:
          await commentAfterTransaction(
            channel,
            (payload as unknown) as AppTransaction<CommentNFTUI>,
          );
          break;
        case 7:
          await commentAfterTransaction(
            channel,
            (payload as unknown) as AppTransaction<CommentCollectionUI>,
          );
          break;
        case 10:
          await commentAfterTransaction(
            channel,
            (payload as unknown) as AppTransaction<ReplyCommentUI>,
          );
          break;
        case 11:
          await commentAfterTransaction(
            channel,
            (payload as unknown) as AppTransaction<CommentCollectionClubsUI>,
          );
          break;
        case 12:
          await commentAfterTransaction(
            channel,
            (payload as unknown) as AppTransaction<CommentNFTClubsUI>,
          );
          break;
        case 13:
          await commentAfterTransaction(
            channel,
            (payload as unknown) as AppTransaction<ReplyCommentClubsUI>,
          );
          break;
        case 19:
          await commentAfterTransaction(
            channel,
            (payload as unknown) as AppTransaction<CommentMomentUI>,
          );
          break;
        case 20:
          await commentAfterTransaction(
            channel,
            (payload as unknown) as AppTransaction<CommentMomentClubsUI>,
          );
          break;
        default:
          break;
      }
      break;
    default:
      break;
  }
}
