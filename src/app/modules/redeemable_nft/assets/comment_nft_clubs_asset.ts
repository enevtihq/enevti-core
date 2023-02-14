import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { RedeemableNFTAccountProps } from 'enevti-types/account/profile';
import { CommentNFTClubsProps } from 'enevti-types/asset/redeemable_nft/comment_nft_clubs_asset';
import { CommentClubsAsset } from 'enevti-types/chain/engagement';
import { ACTIVITY } from '../constants/activity';
import { VALIDATION } from '../constants/validation';
import { commentNftClubsAssetSchema } from '../schemas/asset/comment_nft_clubs_asset';
import { getAccountStats, setAccountStats } from '../utils/account_stats';
import { addActivityEngagement } from '../utils/activity';
import { addNftCommentClubsById } from '../utils/engagement';
import { getNFTById, setNFTById } from '../utils/redeemable_nft';
import { getBlockTimestamp } from '../utils/transaction';

export class CommentNftClubsAsset extends BaseAsset {
  public name = 'commentNftClubs';
  public id = 12;

  // Define schema for asset
  public schema = commentNftClubsAssetSchema;

  public validate({ asset }: ValidateAssetContext<CommentNFTClubsProps>): void {
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
  }: ApplyAssetContext<CommentNFTClubsProps>): Promise<void> {
    const timestamp = getBlockTimestamp(stateStore);
    const nft = await getNFTById(stateStore, asset.id);
    if (!nft) {
      throw new Error('NFT doesnt exists');
    }

    if (
      Buffer.compare(nft.creator, transaction.senderAddress) !== 0 &&
      Buffer.compare(nft.owner, transaction.senderAddress) !== 0
    ) {
      throw new Error('You are not authorized to give comment on this NFT clubs');
    }

    nft.clubs += 1;

    const clubs: CommentClubsAsset = {
      id: transaction.id,
      type: 'nft',
      owner: transaction.senderAddress,
      data: asset.cid,
      date: BigInt(timestamp),
      target: nft.id,
      like: 0,
      reply: 0,
    };
    await addNftCommentClubsById(stateStore, asset.id, clubs);
    await setNFTById(stateStore, asset.id, nft);

    await addActivityEngagement(stateStore, transaction.senderAddress.toString('hex'), {
      transaction: transaction.id,
      name: ACTIVITY.ENGAGEMENT.COMMENTNFTCLUBS,
      date: BigInt(timestamp),
      target: nft.id,
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
