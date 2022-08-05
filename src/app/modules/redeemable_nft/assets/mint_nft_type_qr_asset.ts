import { BaseAsset, ApplyAssetContext, ValidateAssetContext, cryptography } from 'lisk-sdk';
import { mintNftTypeQrAssetSchema } from '../schemas/asset/mint_nft_type_qr_asset';
import {
  MintNFTByQR,
  MintNFTByQRProps,
} from '../../../../types/core/asset/redeemable_nft/mint_nft_type_qr_asset';
import { getCollectionById } from '../utils/collection';
import { mintNFT } from '../utils/mint';

export class MintNftTypeQrAsset extends BaseAsset {
  public name = 'mintNftTypeQr';
  public id = 3;

  // Define schema for asset
  public schema = mintNftTypeQrAssetSchema;

  public validate({ asset }: ValidateAssetContext<MintNFTByQRProps>): void {
    if (asset.body.length === 0) {
      throw new Error(`asset.body cannot be empty`);
    }
    if (asset.signature.length === 0) {
      throw new Error(`asset.signature cannot be empty`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async apply({
    asset,
    transaction,
    stateStore,
    reducerHandler,
  }: ApplyAssetContext<MintNFTByQRProps>): Promise<void> {
    const plainPayload = Buffer.from(asset.body, 'base64').toString();
    const { id, quantity, nonce, publicKey } = JSON.parse(plainPayload) as MintNFTByQR;

    const collection = await getCollectionById(stateStore, id);
    if (!collection) {
      throw new Error('NFT Collection doesnt exist');
    }

    if (!['qr'].includes(collection.mintingType)) {
      throw new Error(`invalid mintingType on specified collection`);
    }

    if (collection.stat.minted !== nonce) {
      throw new Error(`invalid nonce on asset payload`);
    }

    if (
      !cryptography.verifyData(
        cryptography.stringToBuffer(asset.body),
        Buffer.from(asset.signature, 'hex'),
        Buffer.from(publicKey, 'hex'),
      )
    ) {
      throw new Error(`invalid signature, make sure you get valid signature from creator`);
    }

    await mintNFT({
      id,
      quantity,
      stateStore,
      reducerHandler,
      transactionId: transaction.id,
      senderPublicKey: transaction.senderPublicKey,
      type: 'normal',
    });
  }
}
