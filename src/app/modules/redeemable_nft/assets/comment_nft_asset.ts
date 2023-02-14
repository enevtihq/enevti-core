import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { RedeemableNFTAccountProps } from 'enevti-types/account/profile';
import { CommentNFTProps } from 'enevti-types/asset/redeemable_nft/comment_nft_asset';
import { CommentAsset } from 'enevti-types/chain/engagement';
import { ACTIVITY } from '../constants/activity';
import { VALIDATION } from '../constants/validation';
import { commentNftAssetSchema } from '../schemas/asset/comment_nft_asset';
import { getAccountStats, setAccountStats } from '../utils/account_stats';
import { addActivityEngagement } from '../utils/activity';
import { addNFTCommentById } from '../utils/engagement';
import { getNFTById, setNFTById } from '../utils/redeemable_nft';
import { getBlockTimestamp } from '../utils/transaction';

export class CommentNftAsset extends BaseAsset<CommentNFTProps> {
  public name = 'commentNft';
  public id = 6;

  // Define schema for asset
  public schema = commentNftAssetSchema;

  public validate({ asset }: ValidateAssetContext<CommentNFTProps>): void {
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
  }: ApplyAssetContext<CommentNFTProps>): Promise<void> {
    const timestamp = getBlockTimestamp(stateStore);
    const nft = await getNFTById(stateStore, asset.id);
    if (!nft) {
      throw new Error('NFT doesnt exists');
    }

    nft.comment += 1;

    const comment: CommentAsset = {
      id: transaction.id,
      type: 'nft',
      owner: transaction.senderAddress,
      data: asset.cid,
      date: BigInt(timestamp),
      target: nft.id,
      like: 0,
      reply: 0,
    };
    await addNFTCommentById(stateStore, asset.id, comment);
    await setNFTById(stateStore, asset.id, nft);

    await addActivityEngagement(stateStore, transaction.senderAddress.toString('hex'), {
      transaction: transaction.id,
      name: ACTIVITY.ENGAGEMENT.COMMENTNFT,
      date: BigInt(timestamp),
      target: nft.id,
    });

    const senderAccount = await stateStore.account.get<RedeemableNFTAccountProps>(
      transaction.senderAddress,
    );
    senderAccount.redeemableNft.commentSent += 1;
    await stateStore.account.set(transaction.senderAddress, senderAccount);

    const accountStats = await getAccountStats(
      stateStore,
      transaction.senderAddress.toString('hex'),
    );
    accountStats.commentSent.comment.unshift(transaction.id);
    accountStats.commentSent.total =
      accountStats.commentSent.comment.length + accountStats.commentSent.reply.length;
    await setAccountStats(stateStore, transaction.senderAddress.toString('hex'), accountStats);
  }
}
