import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { RedeemableNFTAccountProps } from 'enevti-types/account/profile';
import { CommentCollectionClubsProps } from 'enevti-types/asset/redeemable_nft/comment_collection_clubs_asset';
import { CommentClubsAsset } from 'enevti-types/chain/engagement';
import { ACTIVITY } from '../constants/activity';
import { VALIDATION } from '../constants/validation';
import { commentCollectionClubsAssetSchema } from '../schemas/asset/comment_collection_clubs_asset';
import { getAccountStats, setAccountStats } from '../utils/account_stats';
import { addActivityEngagement } from '../utils/activity';
import { getCollectionById, setCollectionById } from '../utils/collection';
import { addCollectionCommentClubsById } from '../utils/engagement';
import { getBlockTimestamp } from '../utils/transaction';

export class CommentCollectionClubsAsset extends BaseAsset {
  public name = 'commentCollectionClubs';
  public id = 11;

  // Define schema for asset
  public schema = commentCollectionClubsAssetSchema;

  public validate({ asset }: ValidateAssetContext<CommentCollectionClubsProps>): void {
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
  }: ApplyAssetContext<CommentCollectionClubsProps>): Promise<void> {
    const timestamp = getBlockTimestamp(stateStore);
    const collection = await getCollectionById(stateStore, asset.id);
    if (!collection) {
      throw new Error('Collection doesnt exists');
    }

    if (
      Buffer.compare(collection.creator, transaction.senderAddress) !== 0 &&
      collection.stat.owner.findIndex(o => Buffer.compare(o, transaction.senderAddress) === 0) ===
        -1
    ) {
      throw new Error('You are not authorized to give comment on this collection clubs');
    }

    collection.clubs += 1;

    const clubsComment: CommentClubsAsset = {
      id: transaction.id,
      type: 'collection',
      owner: transaction.senderAddress,
      data: asset.cid,
      date: BigInt(timestamp),
      target: collection.id,
      like: 0,
      reply: 0,
    };
    await addCollectionCommentClubsById(stateStore, asset.id, clubsComment);
    await setCollectionById(stateStore, asset.id, collection);

    await addActivityEngagement(stateStore, transaction.senderAddress.toString('hex'), {
      transaction: transaction.id,
      name: ACTIVITY.ENGAGEMENT.COMMENTCOLLECTIONCLUBS,
      date: BigInt(timestamp),
      target: collection.id,
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
    accountStats.commentClubsSent.comment.unshift(transaction.id);
    accountStats.commentClubsSent.total =
      accountStats.commentClubsSent.comment.length + accountStats.commentClubsSent.reply.length;
    await setAccountStats(stateStore, transaction.senderAddress.toString('hex'), accountStats);
  }
}
