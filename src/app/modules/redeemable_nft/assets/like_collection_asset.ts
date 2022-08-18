import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { RedeemableNFTAccountProps } from '../../../../types/core/account/profile';
import { LikeCollectionProps } from '../../../../types/core/asset/redeemable_nft/like_collection_asset';
import { SocialRaffleGenesisConfig } from '../../../../types/core/chain/config/SocialRaffleGenesisConfig';
import { ACTIVITY } from '../constants/activity';
import { likeCollectionAssetSchema } from '../schemas/asset/like_collection_asset';
import { getAccountStats, setAccountStats } from '../utils/account_stats';
import { addActivityEngagement } from '../utils/activity';
import { getCollectionById, setCollectionById } from '../utils/collection';
import { addCollectionLikeById } from '../utils/engagement';
import { addSocialRaffleRegistrar, isCollectionEligibleForRaffle } from '../utils/social_raffle';
import { getBlockTimestamp } from '../utils/transaction';

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
    reducerHandler,
  }: ApplyAssetContext<LikeCollectionProps>): Promise<void> {
    const timestamp = getBlockTimestamp(stateStore);
    const collection = await getCollectionById(stateStore, asset.id);
    if (!collection) {
      throw new Error('Collection doesnt exists');
    }

    collection.like += 1;
    await addCollectionLikeById(stateStore, asset.id, transaction.senderAddress);
    await setCollectionById(stateStore, asset.id, collection);

    await addActivityEngagement(stateStore, transaction.senderAddress.toString('hex'), {
      transaction: transaction.id,
      name: ACTIVITY.ENGAGEMENT.LIKECOLLECTION,
      date: BigInt(timestamp),
      target: collection.id,
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
    accountStats.likeSent.collection.unshift(collection.id);
    accountStats.likeSent.total = Object.keys(accountStats.likeSent).reduce(
      (prev, current) =>
        Array.isArray(accountStats.likeSent[current])
          ? prev + (accountStats.likeSent[current] as unknown[]).length
          : prev + 0,
      0,
    );
    await setAccountStats(stateStore, transaction.senderAddress.toString('hex'), accountStats);

    if (collection.raffled > -1) {
      const socialRaffleConfig: SocialRaffleGenesisConfig['socialRaffle'] = await reducerHandler.invoke(
        'redeemableNft:getSocialRaffleConfig',
      );
      if (isCollectionEligibleForRaffle(collection, socialRaffleConfig)) {
        await addSocialRaffleRegistrar(
          stateStore,
          collection.id,
          transaction.senderPublicKey,
          BigInt(1),
        );
      }
    }
  }
}
