import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { RedeemableNFTAccountProps } from 'enevti-types/account/profile';
import { ReplyCommentProps } from 'enevti-types/asset/redeemable_nft/reply_comment_asset';
import { ReplyAsset } from 'enevti-types/chain/engagement';
import { ACTIVITY } from '../constants/activity';
import { VALIDATION } from '../constants/validation';
import { replyCommentAssetSchema } from '../schemas/asset/reply_comment_asset';
import { getAccountStats, setAccountStats } from '../utils/account_stats';
import { addActivityEngagement } from '../utils/activity';
import { addCommentReplyById, getCommentById, setCommentById } from '../utils/engagement';
import { getBlockTimestamp } from '../utils/transaction';

export class ReplyCommentAsset extends BaseAsset {
  public name = 'replyComment';
  public id = 10;

  // Define schema for asset
  public schema = replyCommentAssetSchema;

  public validate({ asset }: ValidateAssetContext<ReplyCommentProps>): void {
    if (asset.id.length > VALIDATION.ID_MAXLENGTH) {
      throw new Error(`asset.id max length is ${VALIDATION.ID_MAXLENGTH}`);
    }
    if (asset.cid.length > VALIDATION.IPFS_CID_v1_MAXLENGTH) {
      throw new Error(`asset.cid max length is ${VALIDATION.IPFS_CID_v1_MAXLENGTH}`);
    }
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
      data: asset.cid,
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

    const senderAccount = await stateStore.account.get<RedeemableNFTAccountProps>(
      transaction.senderAddress,
    );
    senderAccount.redeemableNft.commentSent += 1;
    await stateStore.account.set(transaction.senderAddress, senderAccount);

    const accountStats = await getAccountStats(
      stateStore,
      transaction.senderAddress.toString('hex'),
    );
    accountStats.commentSent.reply.unshift(transaction.id);
    accountStats.commentSent.total =
      accountStats.commentSent.comment.length + accountStats.commentSent.reply.length;
    await setAccountStats(stateStore, transaction.senderAddress.toString('hex'), accountStats);
  }
}
