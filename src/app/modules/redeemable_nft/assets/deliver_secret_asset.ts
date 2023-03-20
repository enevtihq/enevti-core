import { BaseAsset, ApplyAssetContext, cryptography, ValidateAssetContext } from 'lisk-sdk';
import { AccountChain, RedeemableNFTAccountProps } from 'enevti-types/account/profile';
import { DeliverSecretProps } from 'enevti-types/asset/redeemable_nft/deliver_secret_asset';
import { ID_STRING_MAX_LENGTH } from 'enevti-types/constant/validation';
import { AddActivityParam } from 'enevti-types/param/activity';
import { DELIVER_SECRET_ASSET_ID } from 'enevti-types/constant/id';
import { deliverSecretAssetSchema } from '../schemas/asset/deliver_secret_asset';
import { getNFTById, setNFTById } from '../utils/redeemable_nft';
import { ACTIVITY } from '../constants/activity';
import { getServeRate, setServeRate } from '../utils/serveRate';

export class DeliverSecretAsset extends BaseAsset<DeliverSecretProps> {
  public name = 'deliverSecret';
  public id = DELIVER_SECRET_ASSET_ID;

  // Define schema for asset
  public schema = deliverSecretAssetSchema;

  public validate({ asset }: ValidateAssetContext<DeliverSecretProps>): void {
    if (asset.id.length > ID_STRING_MAX_LENGTH) {
      throw new Error(`asset.id max length is ${ID_STRING_MAX_LENGTH}`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async apply({
    asset,
    transaction,
    stateStore,
    reducerHandler,
  }: ApplyAssetContext<DeliverSecretProps>): Promise<void> {
    const { senderPublicKey, senderAddress } = transaction;
    const senderAccount = await stateStore.account.get<RedeemableNFTAccountProps>(senderAddress);

    if (
      !cryptography.verifyData(
        cryptography.stringToBuffer(asset.cipher),
        Buffer.from(asset.signature.cipher, 'hex'),
        transaction.senderPublicKey,
      )
    ) {
      throw new Error('secret cipher not verified!');
    }

    const nft = await getNFTById(stateStore, asset.id);
    if (!nft) {
      throw new Error('NFT doesnt exist');
    }

    if (Buffer.compare(nft.redeem.secret.sender, senderPublicKey) !== 0) {
      throw new Error('Sender not authorized to deliver secret');
    }

    if (nft.redeem.status !== 'pending-secret') {
      throw new Error('NFT status is not pending-secret');
    }

    const senderServeRate = (await getServeRate(stateStore, senderAccount.address)) ?? {
      score: 0,
      items: [],
    };
    const nftInServeRateIndex = senderServeRate.items.findIndex(
      t =>
        Buffer.compare(t.id, nft.id) === 0 &&
        t.nonce === nft.redeem.velocity &&
        Buffer.compare(t.owner, nft.owner) === 0 &&
        t.status === 0,
    );

    if (nftInServeRateIndex === -1) {
      throw new Error('cannot find NFT in account stats serveRate items');
    }

    senderServeRate.items[nftInServeRateIndex].status = 1;

    const serveRate = Number(
      (
        (senderServeRate.items.filter(t => t.status === 1).length * 10000) /
        senderServeRate.items.length
      ).toFixed(0),
    );

    senderServeRate.score = serveRate;
    senderAccount.redeemableNft.serveRate = serveRate;
    await setServeRate(stateStore, senderAccount.address, senderServeRate);

    nft.redeem.secret.cipher = asset.cipher;
    nft.redeem.secret.signature.cipher = asset.signature.cipher;
    nft.redeem.secret.signature.plain = asset.signature.plain;
    nft.redeem.secret.sender = transaction.senderPublicKey;
    nft.redeem.status = 'ready';
    nft.redeem.nonce += 1;

    const oldSenderState = await reducerHandler.invoke<AccountChain>('activity:getAccount', {
      address: senderAddress.toString('hex'),
    });
    const newSenderState = { ...oldSenderState };
    newSenderState.token.balance += nft.price.amount;

    await reducerHandler.invoke('activity:addActivity', {
      key: `profile:${senderAddress.toString('hex')}`,
      type: ACTIVITY.PROFILE.DELIVERSECRET,
      transaction: transaction.id,
      amount: BigInt(nft.price.amount),
      state: {
        old: oldSenderState,
        new: newSenderState,
      },
    } as AddActivityParam);

    if (nft.price.amount > BigInt(0)) {
      await reducerHandler.invoke('token:credit', {
        address: senderAddress,
        amount: nft.price.amount,
      });
    }

    await reducerHandler.invoke('activity:addActivity', {
      key: `nft:${nft.id.toString('hex')}`,
      type: ACTIVITY.NFT.SECRETDELIVERED,
      transaction: transaction.id,
      amount: BigInt(0),
      state: {
        old: (await getNFTById(stateStore, nft.id.toString('hex'))) as unknown,
        new: nft as unknown,
      },
    } as AddActivityParam);

    await setNFTById(stateStore, nft.id.toString('hex'), nft);

    const index = senderAccount.redeemableNft.pending.findIndex(
      t => t.toString('hex') === asset.id,
    );
    if (index === -1) throw new Error('NFT id not found in account pending list');
    senderAccount.redeemableNft.pending.splice(index, 1);
    await stateStore.account.set(senderAddress, senderAccount);

    await reducerHandler.invoke('activity:addActivity', {
      key: `collection:${nft.collectionId.toString('hex')}`,
      type: ACTIVITY.COLLECTION.SECRETDELIVERED,
      transaction: transaction.id,
      amount: BigInt(0),
      payload: nft.id,
    } as AddActivityParam);
  }
}
