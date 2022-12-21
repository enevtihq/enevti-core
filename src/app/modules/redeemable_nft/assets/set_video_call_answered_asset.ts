import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { RedeemableNFTAccountProps } from '../../../../types/core/account/profile';
import { SetVideoCallAnsweredProps } from '../../../../types/core/asset/redeemable_nft/set_video_call_answered_asset';
import { CollectionActivityChainItems } from '../../../../types/core/chain/collection';
import { NFTActivityChainItems } from '../../../../types/core/chain/nft/NFTActivity';
import { ACTIVITY } from '../constants/activity';
import { COIN_NAME } from '../constants/chain';
import { VALIDATION } from '../constants/validation';
import { setVideoCallAnsweredAssetSchema } from '../schemas/asset/set_video_call_answered_asset';
import { getAccountStats, setAccountStats } from '../utils/account_stats';
import { addActivityCollection, addActivityEngagement, addActivityNFT } from '../utils/activity';
import { getNFTById, setNFTById } from '../utils/redeemable_nft';
import { getBlockTimestamp } from '../utils/transaction';

export class SetVideoCallAnsweredAsset extends BaseAsset {
  public name = 'setVideoCallAnswered';
  public id = 17;

  // Define schema for asset
  public schema = setVideoCallAnsweredAssetSchema;

  public validate({ asset }: ValidateAssetContext<SetVideoCallAnsweredProps>): void {
    if (asset.id.length > VALIDATION.ID_MAXLENGTH) {
      throw new Error(`asset.id max length is ${VALIDATION.ID_MAXLENGTH}`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async apply({
    asset,
    transaction,
    stateStore,
  }: ApplyAssetContext<SetVideoCallAnsweredProps>): Promise<void> {
    const { senderAddress } = transaction;
    const senderAccount = await stateStore.account.get<RedeemableNFTAccountProps>(senderAddress);
    const timestamp = getBlockTimestamp(stateStore);

    const nft = await getNFTById(stateStore, asset.id);
    if (!nft) {
      throw new Error('NFT doesnt exist');
    }

    if (Buffer.compare(nft.owner, senderAddress) !== 0) {
      throw new Error('Sender not authorized to set video call as answered');
    }

    if (nft.redeem.count > 0) {
      throw new Error('NFT has been redeemed before by sender, cannot alter call status!');
    }

    if (nft.utility !== 'videocall') {
      throw new Error('NFT utility is not videocall');
    }

    senderAccount.redeemableNft.momentSlot += 1;
    await stateStore.account.set(senderAddress, senderAccount);

    const senderAccountStats = await getAccountStats(stateStore, senderAddress.toString('hex'));
    senderAccountStats.momentSlot.push(nft.id);
    await setAccountStats(stateStore, senderAddress.toString('hex'), senderAccountStats);

    nft.redeem.count += 1;
    nft.redeem.nonce += 1;
    if (nft.redeem.nonceLimit > 0 && nft.redeem.nonce >= nft.redeem.nonceLimit)
      nft.redeem.status = 'limit-exceeded';
    if (nft.redeem.countLimit > 0 && nft.redeem.count >= nft.redeem.countLimit)
      nft.redeem.status = 'limit-exceeded';
    await setNFTById(stateStore, nft.id.toString('hex'), nft);

    await addActivityEngagement(stateStore, transaction.senderAddress.toString('hex'), {
      transaction: transaction.id,
      name: ACTIVITY.ENGAGEMENT.SETVIDEOCALLANSWERED,
      date: BigInt(timestamp),
      target: nft.id,
    });

    const nftActivity: NFTActivityChainItems = {
      transaction: transaction.id,
      date: BigInt(timestamp),
      name: ACTIVITY.NFT.VIDEOCALLANSWERED,
      to: nft.creator,
      value: {
        amount: BigInt(0),
        currency: COIN_NAME,
      },
    };
    await addActivityNFT(stateStore, nft.id.toString('hex'), nftActivity);

    const collectionActivity: CollectionActivityChainItems = {
      transaction: transaction.id,
      date: BigInt(timestamp),
      name: ACTIVITY.COLLECTION.VIDEOCALLANSWERED,
      to: nft.creator,
      value: {
        amount: BigInt(0),
        currency: COIN_NAME,
      },
      nfts: [nft.id],
    };
    await addActivityCollection(stateStore, nft.collectionId.toString('hex'), collectionActivity);
  }
}
