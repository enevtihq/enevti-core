import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { AccountChain, RedeemableNFTAccountProps } from 'enevti-types/account/profile';
import { SetVideoCallAnsweredProps } from 'enevti-types/asset/redeemable_nft/set_video_call_answered_asset';
import { ID_STRING_MAX_LENGTH } from 'enevti-types/constant/validation';
import { AddActivityParam } from 'enevti-types/param/activity';
import { SET_VIDEO_CALL_ANSWERED_ASSET_ID } from 'enevti-types/constant/id';
import { ACTIVITY } from '../constants/activity';
import { setVideoCallAnsweredAssetSchema } from '../schemas/asset/set_video_call_answered_asset';
import { getNFTById, setNFTById } from '../utils/redeemable_nft';
import { getMomentSlot, setMomentSlot } from '../utils/momentSlot';

export class SetVideoCallAnsweredAsset extends BaseAsset {
  public name = 'setVideoCallAnswered';
  public id = SET_VIDEO_CALL_ANSWERED_ASSET_ID;

  // Define schema for asset
  public schema = setVideoCallAnsweredAssetSchema;

  public validate({ asset }: ValidateAssetContext<SetVideoCallAnsweredProps>): void {
    if (asset.id.length > ID_STRING_MAX_LENGTH) {
      throw new Error(`asset.id max length is ${ID_STRING_MAX_LENGTH}`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async apply({
    asset,
    transaction,
    reducerHandler,
    stateStore,
  }: ApplyAssetContext<SetVideoCallAnsweredProps>): Promise<void> {
    const { senderAddress } = transaction;
    const senderAccount = await stateStore.account.get<RedeemableNFTAccountProps>(senderAddress);

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
      type: ACTIVITY.ENGAGEMENT.SETVIDEOCALLANSWERED,
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
      type: ACTIVITY.NFT.VIDEOCALLANSWERED,
      transaction: transaction.id,
      amount: BigInt(0),
      state: {
        old: (await getNFTById(stateStore, nft.id.toString('hex'))) as unknown,
        new: nft as unknown,
      },
    } as AddActivityParam);

    await reducerHandler.invoke('activity:addActivity', {
      key: `collection:${nft.collectionId.toString('hex')}`,
      type: ACTIVITY.COLLECTION.VIDEOCALLANSWERED,
      transaction: transaction.id,
      payload: nft.id,
      amount: BigInt(0),
    } as AddActivityParam);

    await stateStore.account.set(senderAddress, senderAccount);
    await setMomentSlot(stateStore, senderAddress, senderMomentSlot);
    await setNFTById(stateStore, nft.id.toString('hex'), nft);
  }
}
