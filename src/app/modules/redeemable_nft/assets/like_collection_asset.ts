import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { LikeCollectionProps } from '../../../../types/core/asset/redeemable_nft/like_collection_asset';
import { likeCollectionAssetSchema } from '../schemas/asset/like_collection_asset';
import { getCollectionById, setCollectionById } from '../utils/collection';
import { addCollectionLikeById } from '../utils/engagement';

export class LikeCollectionAsset extends BaseAsset<LikeCollectionProps> {
  public name = 'likeCollection';
  public id = 5;

  // Define schema for asset
  public schema = likeCollectionAssetSchema;

  public validate(_input: ValidateAssetContext<LikeCollectionProps>): void {
    // Validate your asset
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async apply({
    asset,
    transaction,
    stateStore,
  }: ApplyAssetContext<LikeCollectionProps>): Promise<void> {
    const collection = await getCollectionById(stateStore, asset.id);
    if (!collection) {
      throw new Error('Collection doesnt exists');
    }

    collection.like += 1;
    await addCollectionLikeById(stateStore, asset.id, transaction.senderAddress);
    await setCollectionById(stateStore, asset.id, collection);
    // TODO: implement buyback logic
  }
}
