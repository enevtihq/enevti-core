import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { RedeemableNFTAccountProps } from '../../../../types/core/account/profile';
import { CommentMomentProps } from '../../../../types/core/asset/redeemable_nft/comment_moment_asset';
import { CommentAsset } from '../../../../types/core/chain/engagement';
import { ACTIVITY } from '../constants/activity';
import { commentMomentAssetSchema } from '../schemas/asset/comment_moment_asset';
import { getAccountStats, setAccountStats } from '../utils/account_stats';
import { addActivityEngagement } from '../utils/activity';
import { addMomentCommentById } from '../utils/engagement';
import { getMomentById, setMomentById } from '../utils/moment';
import { getBlockTimestamp } from '../utils/transaction';

export class CommentMomentAsset extends BaseAsset {
  public name = 'commentMoment';
  public id = 19;

  // Define schema for asset
  public schema = commentMomentAssetSchema;

  public validate(_input: ValidateAssetContext<CommentMomentProps>): void {
    // Validate your asset
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async apply({
    asset,
    transaction,
    stateStore,
  }: ApplyAssetContext<CommentMomentProps>): Promise<void> {
    const timestamp = getBlockTimestamp(stateStore);
    const moment = await getMomentById(stateStore, asset.id);
    if (!moment) {
      throw new Error('NFT doesnt exists');
    }

    moment.comment += 1;

    const comment: CommentAsset = {
      id: transaction.id,
      type: 'nft',
      owner: transaction.senderAddress,
      data: asset.cid,
      date: BigInt(timestamp),
      target: moment.id,
      like: 0,
      reply: 0,
    };
    await addMomentCommentById(stateStore, asset.id, comment);
    await setMomentById(stateStore, asset.id, moment);

    await addActivityEngagement(stateStore, transaction.senderAddress.toString('hex'), {
      transaction: transaction.id,
      name: ACTIVITY.ENGAGEMENT.COMMENTMOMENT,
      date: BigInt(timestamp),
      target: moment.id,
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
    accountStats.commentSent.comment.unshift(transaction.id);
    accountStats.commentSent.total =
      accountStats.commentSent.comment.length + accountStats.commentSent.reply.length;
    await setAccountStats(stateStore, transaction.senderAddress.toString('hex'), accountStats);
  }
}
