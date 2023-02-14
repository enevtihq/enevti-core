import { BaseAsset, ApplyAssetContext, ValidateAssetContext, cryptography } from 'lisk-sdk';
import { RedeemableNFTAccountProps } from 'enevti-types/account/profile';
import { SetVideoCallRejectedProps } from 'enevti-types/asset/redeemable_nft/set_video_call_rejected_asset';
import { CollectionActivityChainItems } from 'enevti-types/chain/collection';
import { NFTActivityChainItems } from 'enevti-types/chain/nft/NFTActivity';
import { ACTIVITY } from '../constants/activity';
import { COIN_NAME } from '../constants/chain';
import { VALIDATION } from '../constants/validation';
import { setVideoCallRejectedAssetSchema } from '../schemas/asset/set_video_call_rejected_asset';
import { getAccountStats, setAccountStats } from '../utils/account_stats';
import { addActivityEngagement, addActivityNFT, addActivityCollection } from '../utils/activity';
import { getNFTById, setNFTById } from '../utils/redeemable_nft';
import { getBlockTimestamp } from '../utils/transaction';

export class SetVideoCallRejectedAsset extends BaseAsset {
  public name = 'setVideoCallRejected';
  public id = 16;

  // Define schema for asset
  public schema = setVideoCallRejectedAssetSchema;

  public validate({ asset }: ValidateAssetContext<SetVideoCallRejectedProps>): void {
    if (asset.id.length > VALIDATION.ID_MAXLENGTH) {
      throw new Error(`asset.id max length is ${VALIDATION.ID_MAXLENGTH}`);
    }
    if (asset.publicKey.length > VALIDATION.PUBLIC_KEY_MAXLENGTH) {
      throw new Error(`asset.publicKey max length is ${VALIDATION.PUBLIC_KEY_MAXLENGTH}`);
    }
    if (asset.signature.length > VALIDATION.SIGNATURE_MAXLENGTH) {
      throw new Error(`asset.signature max length is ${VALIDATION.SIGNATURE_MAXLENGTH}`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async apply({
    asset,
    transaction,
    stateStore,
  }: ApplyAssetContext<SetVideoCallRejectedProps>): Promise<void> {
    const { senderAddress } = transaction;
    const senderAccount = await stateStore.account.get<RedeemableNFTAccountProps>(senderAddress);
    const timestamp = getBlockTimestamp(stateStore);

    const nft = await getNFTById(stateStore, asset.id);
    if (!nft) {
      throw new Error('NFT doesnt exist');
    }

    const creatorAccount = await stateStore.account.get<RedeemableNFTAccountProps>(nft.creator);

    if (Buffer.compare(nft.owner, senderAddress) !== 0) {
      throw new Error('Sender not authorized to set video call as rejected');
    }

    if (nft.redeem.count > 0) {
      throw new Error('NFT has been redeemed before by sender, cannot alter call status!');
    }

    if (nft.utility !== 'videocall') {
      throw new Error('NFT utility is not videocall');
    }

    const rejectData = `${nft.id.toString('hex')}:${nft.redeem.count}:${nft.redeem.velocity}:${
      nft.redeem.nonce
    }`;
    if (
      !cryptography.verifyData(
        cryptography.stringToBuffer(rejectData),
        Buffer.from(asset.signature, 'hex'),
        Buffer.from(asset.publicKey, 'hex'),
      )
    ) {
      throw new Error('invalid reject payload');
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
      name: ACTIVITY.ENGAGEMENT.SETVIDEOCALLREJECTED,
      date: BigInt(timestamp),
      target: nft.id,
    });

    const nftActivity: NFTActivityChainItems = {
      transaction: transaction.id,
      date: BigInt(timestamp),
      name: ACTIVITY.NFT.VIDEOCALLREJECTED,
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
      name: ACTIVITY.COLLECTION.VIDEOCALLREJECTED,
      to: nft.creator,
      value: {
        amount: BigInt(0),
        currency: COIN_NAME,
      },
      nfts: [nft.id],
    };
    await addActivityCollection(stateStore, nft.collectionId.toString('hex'), collectionActivity);

    const creatorAccountStats = await getAccountStats(stateStore, nft.creator.toString('hex'));
    const nftInServeRateIndex = creatorAccountStats.serveRate.items.findIndex(
      t =>
        Buffer.compare(t.id, nft.id) === 0 &&
        t.nonce === nft.redeem.velocity &&
        Buffer.compare(t.owner, nft.owner) === 0 &&
        t.status === 1,
    );

    if (nftInServeRateIndex === -1) {
      throw new Error('cannot find NFT in creator account stats serveRate items');
    }

    creatorAccountStats.serveRate.items[nftInServeRateIndex].status = 0;

    const serveRate = Number(
      (
        (creatorAccountStats.serveRate.items.filter(t => t.status === 1).length * 10000) /
        creatorAccountStats.serveRate.items.length
      ).toFixed(0),
    );

    creatorAccountStats.serveRate.score = serveRate;
    creatorAccount.redeemableNft.serveRate = serveRate;
    await setAccountStats(stateStore, creatorAccount.address.toString('hex'), creatorAccountStats);
    await stateStore.account.set(nft.creator, creatorAccount);
  }
}
