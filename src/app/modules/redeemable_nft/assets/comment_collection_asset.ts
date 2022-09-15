import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { RedeemableNFTAccountProps } from '../../../../types/core/account/profile';
import { CommentCollectionProps } from '../../../../types/core/asset/redeemable_nft/comment_collection_asset';
import { CommentAsset } from '../../../../types/core/chain/engagement';
import { ACTIVITY } from '../constants/activity';
import { commentCollectionAssetSchema } from '../schemas/asset/comment_collection_asset';
import { getAccountStats, setAccountStats } from '../utils/account_stats';
import { addActivityEngagement } from '../utils/activity';
import { getCollectionById, setCollectionById } from '../utils/collection';
import { addCollectionCommentById } from '../utils/engagement';
import { getBlockTimestamp } from '../utils/transaction';

export class CommentCollectionAsset extends BaseAsset<CommentCollectionProps> {
  public name = 'commentCollection';
  public id = 7;

  // Define schema for asset
  public schema = commentCollectionAssetSchema;

  public validate(_input: ValidateAssetContext<CommentCollectionProps>): void {
    // Validate your asset
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async apply({
    asset,
    transaction,
    stateStore,
  }: ApplyAssetContext<CommentCollectionProps>): Promise<void> {
    const timestamp = getBlockTimestamp(stateStore);
    const collection = await getCollectionById(stateStore, asset.id);
    if (!collection) {
      throw new Error('Collection doesnt exists');
    }

    collection.comment += 1;

    const comment: CommentAsset = {
      id: transaction.id,
      type: 'collection',
      owner: transaction.senderAddress,
      data: asset.cid,
      date: BigInt(timestamp),
      target: collection.id,
      like: 0,
      reply: 0,
    };
    await addCollectionCommentById(stateStore, asset.id, comment);
    await setCollectionById(stateStore, asset.id, collection);

    await addActivityEngagement(stateStore, transaction.senderAddress.toString('hex'), {
      transaction: transaction.id,
      name: ACTIVITY.ENGAGEMENT.COMMENTCOLLECTION,
      date: BigInt(timestamp),
      target: collection.id,
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
