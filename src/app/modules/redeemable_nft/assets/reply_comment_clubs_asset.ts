import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { RedeemableNFTAccountProps } from 'enevti-types/account/profile';
import { ReplyCommentClubsProps } from 'enevti-types/asset/redeemable_nft/reply_comment_clubs_asset';
import { ReplyAsset } from 'enevti-types/chain/engagement';
import { ACTIVITY } from '../constants/activity';
import { VALIDATION } from '../constants/validation';
import { replyCommentClubsAssetSchema } from '../schemas/asset/reply_comment_clubs_asset';
import { getAccountStats, setAccountStats } from '../utils/account_stats';
import { addActivityEngagement } from '../utils/activity';
import { getCollectionById } from '../utils/collection';
import {
  addCommentClubsReplyById,
  getCommentClubsById,
  setCommentClubsById,
} from '../utils/engagement';
import { getNFTById } from '../utils/redeemable_nft';
import { getBlockTimestamp } from '../utils/transaction';

export class ReplyCommentClubsAsset extends BaseAsset {
  public name = 'replyCommentClubs';
  public id = 13;

  // Define schema for asset
  public schema = replyCommentClubsAssetSchema;

  public validate({ asset }: ValidateAssetContext<ReplyCommentClubsProps>): void {
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
  }: ApplyAssetContext<ReplyCommentClubsProps>): Promise<void> {
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

    comment.reply += 1;

    const reply: ReplyAsset = {
      id: transaction.id,
      owner: transaction.senderAddress,
      data: asset.cid,
      date: BigInt(timestamp),
      like: 0,
      target: comment.id,
    };
    await addCommentClubsReplyById(stateStore, asset.id, reply);
    await setCommentClubsById(stateStore, asset.id, comment);

    await addActivityEngagement(stateStore, transaction.senderAddress.toString('hex'), {
      transaction: transaction.id,
      name: ACTIVITY.ENGAGEMENT.REPLYCOMMENTCLUBS,
      date: BigInt(timestamp),
      target: comment.id,
    });

    const senderAccount = await stateStore.account.get<RedeemableNFTAccountProps>(
      transaction.senderAddress,
    );
    senderAccount.redeemableNft.commentClubsSent += 1;
    await stateStore.account.set(transaction.senderAddress, senderAccount);

    const accountStats = await getAccountStats(
      stateStore,
      transaction.senderAddress.toString('hex'),
    );
    accountStats.commentClubsSent.reply.unshift(transaction.id);
    accountStats.commentClubsSent.total =
      accountStats.commentClubsSent.comment.length + accountStats.commentClubsSent.reply.length;
    await setAccountStats(stateStore, transaction.senderAddress.toString('hex'), accountStats);
  }
}
