import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { LikeCommentProps } from '../../../../types/core/asset/redeemable_nft/like_comment_asset';
import { ACTIVITY } from '../constants/activity';
import { likeCommentAssetSchema } from '../schemas/asset/like_comment_asset';
import { getAccountStats, setAccountStats } from '../utils/account_stats';
import { addActivityEngagement } from '../utils/activity';
import { addCommentLikeById, getCommentById, setCommentById } from '../utils/engagement';
import { getBlockTimestamp } from '../utils/transaction';

export class LikeCommentAsset extends BaseAsset {
  public name = 'likeComment';
  public id = 8;

  // Define schema for asset
  public schema = likeCommentAssetSchema;

  public validate(_input: ValidateAssetContext<LikeCommentProps>): void {
    // Validate your asset
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async apply({
    asset,
    transaction,
    stateStore,
  }: ApplyAssetContext<LikeCommentProps>): Promise<void> {
    const timestamp = getBlockTimestamp(stateStore);
    const comment = await getCommentById(stateStore, asset.id);
    if (!comment) {
      throw new Error('Comment doesnt exists');
    }

    comment.like += 1;
    await addCommentLikeById(stateStore, asset.id, transaction.senderAddress);
    await setCommentById(stateStore, asset.id, comment);

    await addActivityEngagement(stateStore, transaction.senderAddress.toString('hex'), {
      transaction: transaction.id,
      name: ACTIVITY.ENGAGEMENT.LIKECOMMENT,
      date: BigInt(timestamp),
      target: comment.id,
    });

    const accountStats = await getAccountStats(
      stateStore,
      transaction.senderAddress.toString('hex'),
    );
    accountStats.likeSent.comment.unshift(comment.id);
    accountStats.likeSent.total =
      accountStats.likeSent.nft.length +
      accountStats.likeSent.collection.length +
      accountStats.likeSent.comment.length +
      accountStats.likeSent.reply.length;
    await setAccountStats(stateStore, transaction.senderAddress.toString('hex'), accountStats);
  }
}