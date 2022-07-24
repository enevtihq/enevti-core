import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { ReplyCommentProps } from '../../../../types/core/asset/redeemable_nft/reply_comment_asset';
import { ReplyAsset } from '../../../../types/core/chain/engagement';
import { ACTIVITY } from '../constants/activity';
import { replyCommentAssetSchema } from '../schemas/asset/reply_comment_asset';
import { addActivityEngagement } from '../utils/activity';
import { addCommentReplyById, getCommentById, setCommentById } from '../utils/engagement';
import { getBlockTimestamp } from '../utils/transaction';

export class ReplyCommentAsset extends BaseAsset {
  public name = 'replyComment';
  public id = 10;

  // Define schema for asset
  public schema = replyCommentAssetSchema;

  public validate(_input: ValidateAssetContext<ReplyCommentProps>): void {
    // Validate your asset
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async apply({
    asset,
    transaction,
    stateStore,
  }: ApplyAssetContext<ReplyCommentProps>): Promise<void> {
    const timestamp = getBlockTimestamp(stateStore);
    const comment = await getCommentById(stateStore, asset.id);
    if (!comment) {
      throw new Error('Comment doesnt exists');
    }

    comment.reply += 1;

    const reply: ReplyAsset = {
      id: transaction.id,
      owner: transaction.senderAddress,
      text: asset.text,
      date: BigInt(timestamp),
      like: 0,
      target: comment.id,
    };
    await addCommentReplyById(stateStore, asset.id, reply);
    await setCommentById(stateStore, asset.id, comment);

    await addActivityEngagement(stateStore, transaction.senderAddress.toString('hex'), {
      transaction: transaction.id,
      name: ACTIVITY.ENGAGEMENT.REPLYCOMMENT,
      date: BigInt(timestamp),
      target: comment.id,
    });
  }
}
