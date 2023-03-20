import { BaseAsset, ApplyAssetContext, ValidateAssetContext, cryptography } from 'lisk-sdk';
import { AccountChain, RedeemableNFTAccountProps } from 'enevti-types/account/profile';
import { SetVideoCallRejectedProps } from 'enevti-types/asset/redeemable_nft/set_video_call_rejected_asset';
import {
  ID_STRING_MAX_LENGTH,
  PUBLIC_KEY_STRING_MAX_LENGTH,
  SIGNATURE_STRING_MAX_LENGTH,
} from 'enevti-types/constant/validation';
import { AddActivityParam } from 'enevti-types/param/activity';
import { SET_VIDEO_CALL_REJECTED_ASSET_ID } from 'enevti-types/constant/id';
import { ACTIVITY } from '../constants/activity';
import { setVideoCallRejectedAssetSchema } from '../schemas/asset/set_video_call_rejected_asset';
import { getNFTById, setNFTById } from '../utils/redeemable_nft';
import { getMomentSlot, setMomentSlot } from '../utils/momentSlot';
import { getServeRate, setServeRate } from '../utils/serveRate';

export class SetVideoCallRejectedAsset extends BaseAsset {
  public name = 'setVideoCallRejected';
  public id = SET_VIDEO_CALL_REJECTED_ASSET_ID;

  // Define schema for asset
  public schema = setVideoCallRejectedAssetSchema;

  public validate({ asset }: ValidateAssetContext<SetVideoCallRejectedProps>): void {
    if (asset.id.length > ID_STRING_MAX_LENGTH) {
      throw new Error(`asset.id max length is ${ID_STRING_MAX_LENGTH}`);
    }
    if (asset.publicKey.length > PUBLIC_KEY_STRING_MAX_LENGTH) {
      throw new Error(`asset.publicKey max length is ${PUBLIC_KEY_STRING_MAX_LENGTH}`);
    }
    if (asset.signature.length > SIGNATURE_STRING_MAX_LENGTH) {
      throw new Error(`asset.signature max length is ${SIGNATURE_STRING_MAX_LENGTH}`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async apply({
    asset,
    transaction,
    reducerHandler,
    stateStore,
  }: ApplyAssetContext<SetVideoCallRejectedProps>): Promise<void> {
    const { senderAddress } = transaction;
    const senderAccount = await stateStore.account.get<RedeemableNFTAccountProps>(senderAddress);

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

    const senderMomentSlot = (await getMomentSlot(stateStore, senderAddress)) ?? { items: [] };
    senderMomentSlot.items.push(nft.id);

    nft.redeem.count += 1;
    nft.redeem.nonce += 1;
    if (nft.redeem.nonceLimit > 0 && nft.redeem.nonce >= nft.redeem.nonceLimit)
      nft.redeem.status = 'limit-exceeded';
    if (nft.redeem.countLimit > 0 && nft.redeem.count >= nft.redeem.countLimit)
      nft.redeem.status = 'limit-exceeded';

    const oldSenderState = await reducerHandler.invoke<AccountChain>('activity:getAccount', {
      address: senderAddress.toString('hex'),
    });
    const newSenderState = { ...oldSenderState };
    newSenderState.redeemableNft.momentSlot += 1;

    // TODO: should we change this activity type to 'addMomentSlot'?
    await reducerHandler.invoke('activity:addActivity', {
      key: `profile:${senderAddress.toString('hex')}`,
      type: ACTIVITY.ENGAGEMENT.SETVIDEOCALLREJECTED,
      transaction: transaction.id,
      amount: BigInt(0),
      payload: nft.id,
      state: {
        old: oldSenderState,
        new: newSenderState,
      },
    } as AddActivityParam);

    await reducerHandler.invoke('activity:addActivity', {
      key: `nft:${nft.id.toString('hex')}`,
      type: ACTIVITY.NFT.VIDEOCALLREJECTED,
      transaction: transaction.id,
      amount: BigInt(0),
      state: {
        old: (await getNFTById(stateStore, nft.id.toString('hex'))) as unknown,
        new: nft as unknown,
      },
    } as AddActivityParam);

    await reducerHandler.invoke('activity:addActivity', {
      key: `collection:${nft.collectionId.toString('hex')}`,
      type: ACTIVITY.COLLECTION.VIDEOCALLREJECTED,
      transaction: transaction.id,
      payload: nft.id,
      amount: BigInt(0),
    } as AddActivityParam);

    const creatorServeRate = (await getServeRate(stateStore, nft.creator)) ?? {
      score: 0,
      items: [],
    };
    const nftInServeRateIndex = creatorServeRate.items.findIndex(
      t =>
        Buffer.compare(t.id, nft.id) === 0 &&
        t.nonce === nft.redeem.velocity &&
        Buffer.compare(t.owner, nft.owner) === 0 &&
        t.status === 1,
    );

    if (nftInServeRateIndex === -1) {
      throw new Error('cannot find NFT in creator account stats serveRate items');
    }

    creatorServeRate.items[nftInServeRateIndex].status = 0;

    const serveRate = Number(
      (
        (creatorServeRate.items.filter(t => t.status === 1).length * 10000) /
        creatorServeRate.items.length
      ).toFixed(0),
    );

    creatorServeRate.score = serveRate;
    creatorAccount.redeemableNft.serveRate = serveRate;

    // TODO: should we add activity for serve rate?
    await setServeRate(stateStore, creatorAccount.address, creatorServeRate);

    // TODO: should we add activity for account set?
    await stateStore.account.set(nft.creator, creatorAccount);

    await stateStore.account.set(senderAddress, senderAccount);
    await setNFTById(stateStore, nft.id.toString('hex'), nft);
    await setMomentSlot(stateStore, senderAddress, senderMomentSlot);
  }
}
