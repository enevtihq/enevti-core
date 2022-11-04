import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { RedeemableNFTAccountProps } from '../../../../types/core/account/profile';
import { CreateMomentAssetProps } from '../../../../types/core/asset/redeemable_nft/create_moment_asset';
import { MomentAsset } from '../../../../types/core/chain/moment';
import { createMomentAssetSchema } from '../schemas/asset/create_moment_asset';
import { getAccountStats, setAccountStats } from '../utils/account_stats';
import { getMomentAt, setMomentAt, setMomentById } from '../utils/moment';
import { getNFTById } from '../utils/redeemable_nft';
import { generateID, getBlockTimestamp } from '../utils/transaction';

export class CreateMomentAsset extends BaseAsset {
  public name = 'createMoment';
  public id = 18;

  // Define schema for asset
  public schema = createMomentAssetSchema;

  public validate(_input: ValidateAssetContext<CreateMomentAssetProps>): void {
    // Validate your asset
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async apply({
    asset,
    transaction,
    stateStore,
  }: ApplyAssetContext<CreateMomentAssetProps>): Promise<void> {
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
  }
}
