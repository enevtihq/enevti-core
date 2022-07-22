import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { CommentCollectionProps } from '../../../../types/core/asset/redeemable_nft/comment_collection_asset';
import { CommentAsset } from '../../../../types/core/chain/engagement';
import { ACTIVITY } from '../constants/activity';
import { commentCollectionAssetSchema } from '../schemas/asset/comment_collection_asset';
import { addActivityEngagement } from '../utils/activity';
import { getCollectionById, setCollectionById } from '../utils/collection';
import { addCollectionCommentById } from '../utils/engagement';
import { generateID, getBlockTimestamp } from '../utils/transaction';

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
      id: generateID(transaction, stateStore, BigInt(0)),
      type: 'collection',
      owner: transaction.senderAddress,
      text: asset.text,
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
  }
}
