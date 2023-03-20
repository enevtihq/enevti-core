import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { AccountChain, RedeemableNFTAccountProps } from 'enevti-types/account/profile';
import { MintMomentProps } from 'enevti-types/asset/redeemable_nft/mint_moment_asset';
import { MomentAsset } from 'enevti-types/chain/moment';
import { CID_STRING_MAX_LENGTH, ID_STRING_MAX_LENGTH } from 'enevti-types/constant/validation';
import { AddActivityParam } from 'enevti-types/param/activity';
import { MINT_MOMENT_ASSET_ID } from 'enevti-types/constant/id';
import { ACTIVITY } from '../constants/activity';
import { VALIDATION } from '../constants/validation';
import { mintMomentAssetSchema } from '../schemas/asset/mint_moment_asset';
import {
  setMomentById,
  getMomentAt,
  setMomentAt,
  getAllMoment,
  setAllMoment,
} from '../utils/moment';
import { getNFTById } from '../utils/redeemable_nft';
import { getBlockTimestamp, generateID } from '../utils/transaction';
import { getMomentSlot, setMomentSlot } from '../utils/momentSlot';

export class MintMomentAsset extends BaseAsset {
  public name = 'mintMoment';
  public id = MINT_MOMENT_ASSET_ID;

  // Define schema for asset
  public schema = mintMomentAssetSchema;

  public validate({ asset }: ValidateAssetContext<MintMomentProps>): void {
    if (asset.nftId.length > ID_STRING_MAX_LENGTH) {
      throw new Error(`asset.nftId max length is ${ID_STRING_MAX_LENGTH}`);
    }
    if (asset.text.length > CID_STRING_MAX_LENGTH) {
      throw new Error(`asset.text max length is ${CID_STRING_MAX_LENGTH}`);
    }
    if (asset.data.length > CID_STRING_MAX_LENGTH) {
      throw new Error(`asset.data max length is ${CID_STRING_MAX_LENGTH}`);
    }
    if (asset.dataMime.length > VALIDATION.MIME_MAXLENGTH) {
      throw new Error(`asset.dataMime max length is ${VALIDATION.MIME_MAXLENGTH}`);
    }
    if (asset.dataExtension.length > VALIDATION.FILE_EXTENSION_MAXLENGTH) {
      throw new Error(`asset.dataExtension max length is ${VALIDATION.FILE_EXTENSION_MAXLENGTH}`);
    }
    if (asset.dataProtocol.length > VALIDATION.FILE_PROTOCOL_MAXLENGTH) {
      throw new Error(`asset.dataProtocol max length is ${VALIDATION.FILE_PROTOCOL_MAXLENGTH}`);
    }
    if (asset.cover.length > CID_STRING_MAX_LENGTH) {
      throw new Error(`asset.cover max length is ${CID_STRING_MAX_LENGTH}`);
    }
    if (asset.coverMime.length > VALIDATION.MIME_MAXLENGTH) {
      throw new Error(`asset.coverMime max length is ${VALIDATION.MIME_MAXLENGTH}`);
    }
    if (asset.coverExtension.length > VALIDATION.FILE_EXTENSION_MAXLENGTH) {
      throw new Error(`asset.coverExtension max length is ${VALIDATION.FILE_EXTENSION_MAXLENGTH}`);
    }
    if (asset.coverProtocol.length > VALIDATION.FILE_PROTOCOL_MAXLENGTH) {
      throw new Error(`asset.coverProtocol max length is ${VALIDATION.FILE_PROTOCOL_MAXLENGTH}`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async apply({
    asset,
    transaction,
    reducerHandler,
    stateStore,
  }: ApplyAssetContext<MintMomentProps>): Promise<void> {
    const timestamp = getBlockTimestamp(stateStore);
    const { senderAddress } = transaction;
    const senderAccount = await stateStore.account.get<RedeemableNFTAccountProps>(senderAddress);
    if (senderAccount.redeemableNft.momentSlot === 0)
      throw new Error('Sender not have any moment slot');

    const nft = await getNFTById(stateStore, asset.nftId);
    if (!nft) throw new Error('invalid NFT id');
    const momentSlot = await getMomentSlot(stateStore, senderAddress);
    if (!momentSlot) {
      throw new Error('momentSlot chain data not found');
    }

    const index = momentSlot.items.findIndex(t => Buffer.compare(t, nft.id) === 0);
    if (index === -1) throw new Error('NFT id not found in sender stats moment slot');
    momentSlot.items.splice(index, 1);
    await setMomentSlot(stateStore, senderAddress, momentSlot);

    const baseMoment: MomentAsset = {
      id: generateID(transaction, stateStore, BigInt(0)),
      nftId: Buffer.from(asset.nftId, 'hex'),
      creator: nft.creator,
      owner: senderAddress,
      createdOn: BigInt(timestamp),
      text: asset.text,
      clubs: 0,
      comment: 0,
      like: 0,
      cover: {
        cid: asset.cover,
        extension: asset.coverExtension,
        mime: asset.coverMime,
        size: asset.coverSize,
        protocol: asset.coverProtocol,
      },
      data: {
        cid: asset.data,
        extension: asset.dataExtension,
        mime: asset.dataMime,
        size: asset.coverSize,
        protocol: asset.coverProtocol,
      },
    };
    const moment = { ...baseMoment };

    const momentAtCollection = await getMomentAt(stateStore, nft.collectionId.toString('hex'));
    momentAtCollection.moment.unshift(moment.id);

    const momentAtNft = await getMomentAt(stateStore, nft.id.toString('hex'));
    momentAtNft.moment.unshift(moment.id);

    senderAccount.redeemableNft.momentSlot -= 1;
    senderAccount.redeemableNft.momentCreated.unshift(moment.id);

    await reducerHandler.invoke('activity:addActivity', {
      key: `collection:${nft.collectionId.toString('hex')}`,
      type: ACTIVITY.COLLECTION.MOMENTCREATED,
      transaction: transaction.id,
      amount: BigInt(0),
      payload: nft.id,
    } as AddActivityParam);

    await reducerHandler.invoke('activity:addActivity', {
      key: `nft:${nft.id.toString('hex')}`,
      type: ACTIVITY.NFT.MOMENTCREATED,
      transaction: transaction.id,
      amount: BigInt(0),
      payload: moment.id,
    } as AddActivityParam);

    const oldSenderState = await reducerHandler.invoke<AccountChain>('activity:getAccount', {
      address: senderAddress.toString('hex'),
    });
    const newSenderState = { ...oldSenderState };
    newSenderState.redeemableNft.momentSlot -= 1;
    newSenderState.redeemableNft.momentCreated.unshift(moment.id);

    await reducerHandler.invoke('activity:addActivity', {
      key: `profile:${senderAddress.toString('hex')}`,
      type: ACTIVITY.PROFILE.MOMENTCREATED,
      transaction: transaction.id,
      amount: BigInt(0),
      state: {
        old: oldSenderState,
        new: newSenderState,
      },
    } as AddActivityParam);

    await reducerHandler.invoke('activity:addActivity', {
      key: `moment:${moment.id.toString('hex')}`,
      type: ACTIVITY.MOMENT.MINTED,
      transaction: transaction.id,
      amount: BigInt(0),
      state: {
        old: baseMoment as unknown,
        new: moment as unknown,
      },
    } as AddActivityParam);

    const allMoment = await getAllMoment(stateStore);
    allMoment.items.unshift(moment.id);

    // TODO: should we add activity to set moment at function?
    await setMomentAt(stateStore, nft.collectionId.toString('hex'), momentAtCollection);
    await setMomentAt(stateStore, nft.id.toString('hex'), momentAtNft);

    await setMomentById(stateStore, moment.id.toString('hex'), moment);
    await setAllMoment(stateStore, allMoment);
    await stateStore.account.set(senderAddress, senderAccount);
  }
}
