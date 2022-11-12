import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import {
  RedeemableNFTAccountProps,
  ProfileActivityChainItems,
} from '../../../../types/core/account/profile';
import { MintMomentProps } from '../../../../types/core/asset/redeemable_nft/mint_moment_asset';
import { CollectionActivityChainItems } from '../../../../types/core/chain/collection';
import { MomentAsset, MomentActivityChainItems } from '../../../../types/core/chain/moment';
import { NFTActivityChainItems } from '../../../../types/core/chain/nft/NFTActivity';
import { ACTIVITY } from '../constants/activity';
import { COIN_NAME } from '../constants/chain';
import { mintMomentAssetSchema } from '../schemas/asset/mint_moment_asset';
import { getAccountStats, setAccountStats } from '../utils/account_stats';
import {
  addActivityCollection,
  addActivityNFT,
  addActivityProfile,
  addActivityMoment,
} from '../utils/activity';
import {
  setMomentById,
  getMomentAt,
  setMomentAt,
  getAllMoment,
  setAllMoment,
} from '../utils/moment';
import { getNFTById } from '../utils/redeemable_nft';
import { getBlockTimestamp, generateID } from '../utils/transaction';

export class MintMomentAsset extends BaseAsset {
  public name = 'mintMoment';
  public id = 18;

  // Define schema for asset
  public schema = mintMomentAssetSchema;

  public validate(_input: ValidateAssetContext<MintMomentProps>): void {
    // Validate your asset
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async apply({
    asset,
    transaction,
    stateStore,
  }: ApplyAssetContext<MintMomentProps>): Promise<void> {
    const timestamp = getBlockTimestamp(stateStore);
    const { senderAddress } = transaction;
    const senderAccount = await stateStore.account.get<RedeemableNFTAccountProps>(senderAddress);
    if (senderAccount.redeemableNft.momentSlot === 0)
      throw new Error('Sender not have any moment slot');

    const nft = await getNFTById(stateStore, asset.nftId);
    if (!nft) throw new Error('invalid NFT id');
    const accountStats = await getAccountStats(stateStore, senderAddress.toString('hex'));
    const index = accountStats.momentSlot.findIndex(t => Buffer.compare(t, nft.id) === 0);
    if (index === -1) throw new Error('NFT id not found in sender stats moment slot');
    accountStats.momentSlot.splice(index, 1);
    await setAccountStats(stateStore, senderAddress.toString('hex'), accountStats);

    const moment: MomentAsset = {
      id: generateID(transaction, stateStore, BigInt(0)),
      nftId: Buffer.from(asset.nftId, 'hex'),
      creator: senderAddress,
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
    await setMomentById(stateStore, moment.id.toString('hex'), moment);

    const momentAtCollection = await getMomentAt(stateStore, nft.collectionId.toString('hex'));
    momentAtCollection.moment.unshift(moment.id);
    await setMomentAt(stateStore, nft.collectionId.toString('hex'), momentAtCollection);

    const momentAtNft = await getMomentAt(stateStore, nft.id.toString('hex'));
    momentAtNft.moment.unshift(moment.id);
    await setMomentAt(stateStore, nft.id.toString('hex'), momentAtNft);

    senderAccount.redeemableNft.momentSlot -= 1;
    senderAccount.redeemableNft.momentCreated.unshift(moment.id);
    await stateStore.account.set(senderAddress, senderAccount);

    const collectionActivity: CollectionActivityChainItems = {
      transaction: transaction.id,
      date: BigInt(timestamp),
      name: ACTIVITY.COLLECTION.MOMENTCREATED,
      to: senderAddress,
      value: {
        amount: BigInt(0),
        currency: COIN_NAME,
      },
      nfts: [nft.id],
    };
    await addActivityCollection(stateStore, nft.collectionId.toString('hex'), collectionActivity);

    const nftActivity: NFTActivityChainItems = {
      transaction: transaction.id,
      date: BigInt(timestamp),
      name: ACTIVITY.NFT.MOMENTCREATED,
      to: senderAddress,
      value: {
        amount: BigInt(0),
        currency: COIN_NAME,
      },
    };
    await addActivityNFT(stateStore, nft.id.toString('hex'), nftActivity);

    const profileActivity: ProfileActivityChainItems = {
      transaction: transaction.id,
      date: BigInt(timestamp),
      name: ACTIVITY.PROFILE.MOMENTCREATED,
      from: senderAddress,
      to: Buffer.alloc(0),
      payload: nft.collectionId,
      value: {
        amount: BigInt(0),
        currency: COIN_NAME,
      },
    };
    await addActivityProfile(stateStore, senderAddress.toString('hex'), profileActivity);

    const momentActivity: MomentActivityChainItems = {
      transaction: transaction.id,
      date: BigInt(timestamp),
      name: ACTIVITY.MOMENT.MINTED,
      to: senderAddress,
      value: {
        amount: BigInt(0),
        currency: COIN_NAME,
      },
    };
    await addActivityMoment(stateStore, moment.id.toString('hex'), momentActivity);

    const allMoment = await getAllMoment(stateStore);
    allMoment.items.unshift(moment.id);
    await setAllMoment(stateStore, allMoment);
  }
}
