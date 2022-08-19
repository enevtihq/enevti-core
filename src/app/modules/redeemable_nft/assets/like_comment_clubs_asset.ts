import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { RedeemableNFTAccountProps } from '../../../../types/core/account/profile';
import { LikeCommentClubsProps } from '../../../../types/core/asset/redeemable_nft/like_comment_clubs_asset';
import { ACTIVITY } from '../constants/activity';
import { likeCommentClubsAssetSchema } from '../schemas/asset/like_comment_clubs_asset';
import { getAccountStats, setAccountStats } from '../utils/account_stats';
import { addActivityEngagement } from '../utils/activity';
import { getCollectionById } from '../utils/collection';
import {
  addCommentClubsLikeById,
  getCommentClubsById,
  setCommentClubsById,
} from '../utils/engagement';
import { getNFTById } from '../utils/redeemable_nft';
import { getBlockTimestamp } from '../utils/transaction';

export class LikeCommentClubsAsset extends BaseAsset {
  public name = 'likeCommentClubs';
  public id = 15;

  // Define schema for asset
  public schema = likeCommentClubsAssetSchema;

  public validate(_input: ValidateAssetContext<LikeCommentClubsProps>): void {
    // Validate your asset
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async apply({
    asset,
    transaction,
    stateStore,
  }: ApplyAssetContext<LikeCommentClubsProps>): Promise<void> {
    const timestamp = getBlockTimestamp(stateStore);
    const comment = await getCommentClubsById(stateStore, asset.id);
    if (!comment) {
      throw new Error('Comment doesnt exists');
    }

    if (comment.type === 'nft') {
      const nft = await getNFTById(stateStore, comment.target.toString('hex'));
      if (!nft) {
        throw new Error('NFT not found while checking authorization');
      }
      if (
        Buffer.compare(nft.creator, transaction.senderAddress) !== 0 &&
        Buffer.compare(nft.owner, transaction.senderAddress) !== 0
      ) {
        throw new Error('You are not authorized to give reply on this NFT clubs');
      }
    } else if (comment.type === 'collection') {
      const collection = await getCollectionById(stateStore, comment.target.toString('hex'));
      if (!collection) {
        throw new Error('Collection not found while checking authorization');
      }
      if (
        Buffer.compare(collection.creator, transaction.senderAddress) !== 0 &&
        collection.stat.owner.findIndex(o => Buffer.compare(o, transaction.senderAddress) === 0) ===
          -1
      ) {
        throw new Error('You are not authorized to give reply on this collection clubs');
      }
    }

    comment.like += 1;
    await addCommentClubsLikeById(stateStore, asset.id, transaction.senderAddress);
    await setCommentClubsById(stateStore, asset.id, comment);

    await addActivityEngagement(stateStore, transaction.senderAddress.toString('hex'), {
      transaction: transaction.id,
      name: ACTIVITY.ENGAGEMENT.LIKECOMMENTCLUBS,
      date: BigInt(timestamp),
      target: comment.id,
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
    accountStats.likeSent.commentClubs.unshift(comment.id);
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
