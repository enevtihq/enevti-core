import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { MintNFTProps } from 'enevti-types/asset/redeemable_nft/mint_nft_asset';
import { ID_STRING_MAX_LENGTH } from 'enevti-types/constant/validation';
import { MINT_NFT_ASSET_ID } from 'enevti-types/constant/id';
import { mintNftAssetSchema } from '../schemas/asset/mint_nft_asset';
import { getCollectionById } from '../utils/collection';
import { mintNFT } from '../utils/mint';

export class MintNftAsset extends BaseAsset<MintNFTProps> {
  public name = 'mintNft';
  public id = MINT_NFT_ASSET_ID;

  // Define schema for asset
  public schema = mintNftAssetSchema;

  public validate({ asset }: ValidateAssetContext<MintNFTProps>): void {
    if (asset.id.length > ID_STRING_MAX_LENGTH) {
      throw new Error(`asset.id max length is ${ID_STRING_MAX_LENGTH}`);
    }
    if (asset.quantity <= 0) {
      throw new Error(`asset.quantity must be greater than 0`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async apply({
    asset,
    transaction,
    stateStore,
    reducerHandler,
  }: ApplyAssetContext<MintNFTProps>): Promise<void> {
    const collection = await getCollectionById(stateStore, asset.id);
    if (!collection) {
      throw new Error('NFT Collection doesnt exist');
    }

    if (!['', 'normal'].includes(collection.mintingType)) {
      throw new Error(`invalid mintingType on specified collection`);
    }

    await mintNFT({
      id: asset.id,
      quantity: asset.quantity,
      transactionId: transaction.id,
      senderPublicKey: transaction.senderPublicKey,
      type: 'normal',
      stateStore,
      reducerHandler,
    });
  }
}
