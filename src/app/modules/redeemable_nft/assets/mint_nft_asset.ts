import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { mintNftAssetSchema } from '../schemas/asset/mint_nft_asset';
import { MintNFTProps } from '../../../../types/core/asset/redeemable_nft/mint_nft_asset';
import { getCollectionById } from '../utils/collection';
import { mintNFT } from '../utils/mint';
import { VALIDATION } from '../constants/validation';

export class MintNftAsset extends BaseAsset<MintNFTProps> {
  public name = 'mintNft';
  public id = 1;

  // Define schema for asset
  public schema = mintNftAssetSchema;

  public validate({ asset }: ValidateAssetContext<MintNFTProps>): void {
    if (asset.id.length > VALIDATION.ID_MAXLENGTH) {
      throw new Error(`asset.id max length is ${VALIDATION.ID_MAXLENGTH}`);
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
