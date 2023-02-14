import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { RedeemableNFTAccountProps } from 'enevti-types/account/profile';
import { LikeReplyClubsProps } from 'enevti-types/asset/redeemable_nft/like_reply_clubs_asset';
import { ACTIVITY } from '../constants/activity';
import { VALIDATION } from '../constants/validation';
import { likeReplyClubsAssetSchema } from '../schemas/asset/like_reply_clubs_asset';
import { getAccountStats, setAccountStats } from '../utils/account_stats';
import { addActivityEngagement } from '../utils/activity';
import { getCollectionById } from '../utils/collection';
import {
  addReplyClubsLikeById,
  getCommentClubsById,
  getReplyClubsById,
  setReplyClubsById,
} from '../utils/engagement';
import { getNFTById } from '../utils/redeemable_nft';
import { getBlockTimestamp } from '../utils/transaction';

export class LikeReplyClubsAsset extends BaseAsset {
  public name = 'likeReplyClubs';
  public id = 14;

  // Define schema for asset
  public schema = likeReplyClubsAssetSchema;

  public validate({ asset }: ValidateAssetContext<LikeReplyClubsProps>): void {
    if (asset.id.length > VALIDATION.ID_MAXLENGTH) {
      throw new Error(`asset.id max length is ${VALIDATION.ID_MAXLENGTH}`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async apply({
    asset,
    transaction,
    stateStore,
  }: ApplyAssetContext<LikeReplyClubsProps>): Promise<void> {
    const timestamp = getBlockTimestamp(stateStore);
    const reply = await getReplyClubsById(stateStore, asset.id);
    if (!reply) {
      throw new Error('Reply doesnt exists');
    }

    const commentClubs = await getCommentClubsById(stateStore, reply.target.toString('hex'));
    if (!commentClubs) {
      throw new Error('Comment target not found while authorizing');
    }

    if (commentClubs.type === 'nft') {
      const nft = await getNFTById(stateStore, commentClubs.target.toString('hex'));
      if (!nft) {
        throw new Error('NFT not found while checking authorization');
      }
      if (
        Buffer.compare(nft.creator, transaction.senderAddress) !== 0 &&
        Buffer.compare(nft.owner, transaction.senderAddress) !== 0
      ) {
        throw new Error('You are not authorized to give reply on this NFT clubs');
      }
    } else if (commentClubs.type === 'collection') {
      const collection = await getCollectionById(stateStore, commentClubs.target.toString('hex'));
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

    reply.like += 1;
    await addReplyClubsLikeById(stateStore, asset.id, transaction.senderAddress);
    await setReplyClubsById(stateStore, asset.id, reply);

    await addActivityEngagement(stateStore, transaction.senderAddress.toString('hex'), {
      transaction: transaction.id,
      name: ACTIVITY.ENGAGEMENT.LIKEREPLYCLUBS,
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
    accountStats.likeSent.replyClubs.unshift(reply.id);
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
