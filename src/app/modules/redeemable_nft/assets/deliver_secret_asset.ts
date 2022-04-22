import { BaseAsset, ApplyAssetContext } from 'lisk-sdk';
import { deliverSecretAssetSchema } from '../schemas/asset/deliver_secret_asset';
import { DeliverSecretProps } from '../../../../types/core/asset/redeemable_nft/deliver_secret_asset';
import { getNFTById, setNFTById } from '../utils/redeemable_nft';

export class DeliverSecretAsset extends BaseAsset<DeliverSecretProps> {
  public name = 'deliverSecret';
  public id = 2;

  // Define schema for asset
  public schema = deliverSecretAssetSchema;

  public validate(): void {
    // Validate your asset
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async apply({
    asset,
    transaction,
    stateStore,
  }: ApplyAssetContext<DeliverSecretProps>): Promise<void> {
    const { senderPublicKey } = transaction;
    const nft = await getNFTById(stateStore, asset.id);
    if (!nft) {
      throw new Error("NFT doesn't exist");
    }

    if (nft.redeem.secret.sender !== senderPublicKey) {
      throw new Error('Sender not authorized to deliver secret');
    }

    if (nft.redeem.status !== 'pending-secret') {
      throw new Error('NFT status is not "pending-secret"');
    }

    nft.redeem.secret.cipher = asset.cipher;
    nft.redeem.secret.signature = asset.signature;

    await setNFTById(stateStore, nft.id.toString('hex'), nft);
  }
}
