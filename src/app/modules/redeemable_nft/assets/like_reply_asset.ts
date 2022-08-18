import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { RedeemableNFTAccountProps } from '../../../../types/core/account/profile';
import { LikeReplyProps } from '../../../../types/core/asset/redeemable_nft/like_reply_asset';
import { ACTIVITY } from '../constants/activity';
import { likeReplyAssetSchema } from '../schemas/asset/like_reply_asset';
import { getAccountStats, setAccountStats } from '../utils/account_stats';
import { addActivityEngagement } from '../utils/activity';
import { addReplyLikeById, getReplyById, setReplyById } from '../utils/engagement';
import { getBlockTimestamp } from '../utils/transaction';

export class LikeReplyAsset extends BaseAsset {
  public name = 'likeReply';
  public id = 9;

  // Define schema for asset
  public schema = likeReplyAssetSchema;

  public validate(_input: ValidateAssetContext<LikeReplyProps>): void {
    // Validate your asset
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async apply({
    asset,
    transaction,
    stateStore,
  }: ApplyAssetContext<LikeReplyProps>): Promise<void> {
    const timestamp = getBlockTimestamp(stateStore);
    const reply = await getReplyById(stateStore, asset.id);
    if (!reply) {
      throw new Error('Reply doesnt exists');
    }

    reply.like += 1;
    await addReplyLikeById(stateStore, asset.id, transaction.senderAddress);
    await setReplyById(stateStore, asset.id, reply);

    await addActivityEngagement(stateStore, transaction.senderAddress.toString('hex'), {
      transaction: transaction.id,
      name: ACTIVITY.ENGAGEMENT.LIKEREPLY,
      date: BigInt(timestamp),
      target: reply.id,
    });

    const senderAccount = await stateStore.account.get<RedeemableNFTAccountProps>(
      transaction.senderAddress,
    );
    senderAccount.redeemableNft.likeSent += 1;
    await stateStore.account.set(transaction.senderAddress, senderAccount);

    const accountStats = await getAccountStats(
      stateStore,
      transaction.senderAddress.toString('hex'),
    );
    accountStats.likeSent.reply.unshift(reply.id);
    accountStats.likeSent.total = Object.keys(accountStats.likeSent).reduce(
      (prev, current) =>
        Array.isArray(accountStats.likeSent[current])
          ? prev + (accountStats.likeSent[current] as unknown[]).length
          : prev + 0,
      0,
    );
    await setAccountStats(stateStore, transaction.senderAddress.toString('hex'), accountStats);
  }
}
