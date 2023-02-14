import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { RedeemableNFTAccountProps } from 'enevti-types/account/profile';
import { LikeMomentProps } from 'enevti-types/asset/redeemable_nft/like_moment_asset';
import { ACTIVITY } from '../constants/activity';
import { VALIDATION } from '../constants/validation';
import { likeMomentAssetSchema } from '../schemas/asset/like_moment_asset';
import { getAccountStats, setAccountStats } from '../utils/account_stats';
import { addActivityEngagement } from '../utils/activity';
import { addMomentLikeById } from '../utils/engagement/like/moment';
import { getMomentById, setMomentById } from '../utils/moment';
import { getBlockTimestamp } from '../utils/transaction';

export class LikeMomentAsset extends BaseAsset {
  public name = 'likeMoment';
  public id = 21;

  // Define schema for asset
  public schema = likeMomentAssetSchema;

  public validate({ asset }: ValidateAssetContext<LikeMomentProps>): void {
    if (asset.id.length > VALIDATION.ID_MAXLENGTH) {
      throw new Error(`asset.id max length is ${VALIDATION.ID_MAXLENGTH}`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async apply({
    asset,
    transaction,
    stateStore,
  }: ApplyAssetContext<LikeMomentProps>): Promise<void> {
    const timestamp = getBlockTimestamp(stateStore);
    const moment = await getMomentById(stateStore, asset.id);
    if (!moment) {
      throw new Error('Moment doesnt exists');
    }

    moment.like += 1;
    await addMomentLikeById(stateStore, asset.id, transaction.senderAddress);
    await setMomentById(stateStore, asset.id, moment);

    await addActivityEngagement(stateStore, transaction.senderAddress.toString('hex'), {
      transaction: transaction.id,
      name: ACTIVITY.ENGAGEMENT.LIKEMOMENT,
      date: BigInt(timestamp),
      target: moment.id,
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
    accountStats.likeSent.moment.unshift(moment.id);
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
