import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { CommentNFTProps } from '../../../../types/core/asset/redeemable_nft/comment_nft_asset';
import { CommentAsset } from '../../../../types/core/chain/engagement';
import { commentNftAssetSchema } from '../schemas/asset/comment_nft_asset';
import { addNFTCommentById } from '../utils/engagement';
import { getNFTById, setNFTById } from '../utils/redeemable_nft';
import { getBlockTimestamp } from '../utils/transaction';

export class CommentNftAsset extends BaseAsset<CommentNFTProps> {
  public name = 'commentNft';
  public id = 6;

  // Define schema for asset
  public schema = commentNftAssetSchema;

  public validate(_input: ValidateAssetContext<CommentNFTProps>): void {
    // Validate your asset
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async apply({
    asset,
    transaction,
    stateStore,
  }: ApplyAssetContext<CommentNFTProps>): Promise<void> {
    const nft = await getNFTById(stateStore, asset.id);
    if (!nft) {
      throw new Error('NFT doesnt exists');
    }

    nft.comment += 1;

    const comment: CommentAsset = {
      type: 'nft',
      owner: transaction.senderAddress,
      text: asset.text,
      date: BigInt(getBlockTimestamp(stateStore)),
      target: nft.id,
    };
    await addNFTCommentById(stateStore, asset.id, comment);
    await setNFTById(stateStore, asset.id, nft);
  }
}