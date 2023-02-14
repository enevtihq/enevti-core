import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { RedeemableNFTAccountProps } from 'enevti-types/account/profile';
import { LikeNFTProps } from 'enevti-types/asset/redeemable_nft/like_nft_asset';
import { ACTIVITY } from '../constants/activity';
import { VALIDATION } from '../constants/validation';
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

  public validate({ asset }: ValidateAssetContext<LikeNFTProps>): void {
    if (asset.id.length > VALIDATION.ID_MAXLENGTH) {
      throw new Error(`asset.id max length is ${VALIDATION.ID_MAXLENGTH}`);
    }
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

    const senderAccount = await stateStore.account.get<RedeemableNFTAccountProps>(
      transaction.senderAddress,
    );
    senderAccount.redeemableNft.likeSent += 1;
    await stateStore.account.set(transaction.senderAddress, senderAccount);

    const accountStats = await getAccountStats(
      stateStore,
      transaction.senderAddress.toString('hex'),
    );
    accountStats.likeSent.nft.unshift(nft.id);
    accountStats.likeSent.total = Object.keys(accountStats.likeSent).reduce(
      (prev, current) =>
        Array.isArray(accountStats.likeSent[current])
          ? prev + (accountStats.likeSent[current] as unknown[]).length
          : prev + 0,
      0,
    );
    await setAccountStats(stateStore, transaction.senderAddress.toString('hex'), accountStats);
  }
}
