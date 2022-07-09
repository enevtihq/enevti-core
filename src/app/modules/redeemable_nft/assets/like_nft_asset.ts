import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { LikeNFTProps } from '../../../../types/core/asset/redeemable_nft/like_nft_asset';
import { likeNftAssetSchema } from '../schemas/asset/like_nft_asset';
import { addNFTLikeById } from '../utils/engagement';
import { getNFTById, setNFTById } from '../utils/redeemable_nft';

export class LikeNftAsset extends BaseAsset<LikeNFTProps> {
  public name = 'likeNft';
  public id = 4;

  // Define schema for asset
  public schema = likeNftAssetSchema;

  public validate(_input: ValidateAssetContext<LikeNFTProps>): void {
    // Validate your asset
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async apply({
    asset,
    transaction,
    stateStore,
  }: ApplyAssetContext<LikeNFTProps>): Promise<void> {
    const nft = await getNFTById(stateStore, asset.id);
    if (!nft) {
      throw new Error('NFT doesnt exists');
    }

    nft.like += 1;
    await addNFTLikeById(stateStore, asset.id, transaction.senderAddress);
    await setNFTById(stateStore, asset.id, nft);
    // TODO: implement buyback logic
  }
}
