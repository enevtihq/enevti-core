import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { RedeemableNFTAccountProps } from '../../../../types/core/account/profile';
import { CommentMomentClubsProps } from '../../../../types/core/asset/redeemable_nft/comment_moment_clubs_asset';
import { CommentClubsAsset } from '../../../../types/core/chain/engagement';
import { ACTIVITY } from '../constants/activity';
import { VALIDATION } from '../constants/validation';
import { commentMomentClubsAssetSchema } from '../schemas/asset/comment_moment_clubs_asset';
import { getAccountStats, setAccountStats } from '../utils/account_stats';
import { addActivityEngagement } from '../utils/activity';
import { addMomentCommentClubsById } from '../utils/engagement';
import { getMomentById, setMomentById } from '../utils/moment';
import { getNFTById } from '../utils/redeemable_nft';
import { getBlockTimestamp } from '../utils/transaction';

export class CommentMomentClubsAsset extends BaseAsset {
  public name = 'commentMomentClubs';
  public id = 20;

  // Define schema for asset
  public schema = commentMomentClubsAssetSchema;

  public validate({ asset }: ValidateAssetContext<CommentMomentClubsProps>): void {
    if (asset.id.length > VALIDATION.ID_MAXLENGTH) {
      throw new Error(`asset.id max length is ${VALIDATION.ID_MAXLENGTH}`);
    }
    if (asset.cid.length > VALIDATION.IPFS_CID_v1_MAXLENGTH) {
      throw new Error(`asset.cid max length is ${VALIDATION.IPFS_CID_v1_MAXLENGTH}`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async apply({
    asset,
    transaction,
    stateStore,
  }: ApplyAssetContext<CommentMomentClubsProps>): Promise<void> {
    const timestamp = getBlockTimestamp(stateStore);
    const moment = await getMomentById(stateStore, asset.id);
    if (!moment) {
      throw new Error('Moment doesnt exists');
    }

    const nft = await getNFTById(stateStore, moment.nftId.toString('hex'));
    if (!nft) {
      throw new Error('NFT doesnt exists');
    }

    if (
      Buffer.compare(moment.creator, transaction.senderAddress) !== 0 &&
      Buffer.compare(nft.creator, transaction.senderAddress) !== 0 &&
      Buffer.compare(nft.owner, transaction.senderAddress) !== 0
    ) {
      throw new Error('You are not authorized to give comment on this Moment clubs');
    }

    moment.clubs += 1;

    const clubs: CommentClubsAsset = {
      id: transaction.id,
      type: 'moment',
      owner: transaction.senderAddress,
      data: asset.cid,
      date: BigInt(timestamp),
      target: moment.id,
      like: 0,
      reply: 0,
    };
    await addMomentCommentClubsById(stateStore, asset.id, clubs);
    await setMomentById(stateStore, asset.id, moment);

    await addActivityEngagement(stateStore, transaction.senderAddress.toString('hex'), {
      transaction: transaction.id,
      name: ACTIVITY.ENGAGEMENT.COMMENTMOMENTCLUBS,
      date: BigInt(timestamp),
      target: moment.id,
    });

    const senderAccount = await stateStore.account.get<RedeemableNFTAccountProps>(
      transaction.senderAddress,
    );
    senderAccount.redeemableNft.commentClubsSent += 1;
    await stateStore.account.set(transaction.senderAddress, senderAccount);

    const accountStats = await getAccountStats(
      stateStore,
      transaction.senderAddress.toString('hex'),
    );
    accountStats.commentClubsSent.comment.unshift(transaction.id);
    accountStats.commentClubsSent.total =
      accountStats.commentClubsSent.comment.length + accountStats.commentClubsSent.reply.length;
    await setAccountStats(stateStore, transaction.senderAddress.toString('hex'), accountStats);
  }
}
