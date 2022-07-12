import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { LikeNFTProps } from '../../../../types/core/asset/redeemable_nft/like_nft_asset';
import { ACTIVITY } from '../constants/activity';
import { likeNftAssetSchema } from '../schemas/asset/like_nft_asset';
import { getAccountStats, setAccountStats } from '../utils/account_stats';
import { addActivityEngagement } from '../utils/activity';
import { addNFTLikeById } from '../utils/engagement';
import { getNFTById, setNFTById } from '../utils/redeemable_nft';
import { getBlockTimestamp } from '../utils/transaction';

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
    const timestamp = getBlockTimestamp(stateStore);
    const nft = await getNFTById(stateStore, asset.id);
    if (!nft) {
      throw new Error('NFT doesnt exists');
    }

    nft.like += 1;
    await addNFTLikeById(stateStore, asset.id, transaction.senderAddress);
    await setNFTById(stateStore, asset.id, nft);

    await addActivityEngagement(stateStore, transaction.senderAddress.toString('hex'), {
      transaction: transaction.id,
      name: ACTIVITY.ENGAGEMENT.LIKENFT,
      date: BigInt(timestamp),
      target: nft.id,
    });

    const accountStats = await getAccountStats(
      stateStore,
      transaction.senderAddress.toString('hex'),
    );
    accountStats.likeSent.nft.unshift(nft.id);
    accountStats.likeSent.total =
      accountStats.likeSent.nft.length + accountStats.likeSent.collection.length;
    await setAccountStats(stateStore, transaction.senderAddress.toString('hex'), accountStats);
    // TODO: implement buyback logic
  }
}
