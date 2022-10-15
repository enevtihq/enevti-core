import { BaseAsset, ApplyAssetContext, cryptography } from 'lisk-sdk';
import { deliverSecretAssetSchema } from '../schemas/asset/deliver_secret_asset';
import { DeliverSecretProps } from '../../../../types/core/asset/redeemable_nft/deliver_secret_asset';
import { getNFTById, setNFTById } from '../utils/redeemable_nft';
import { NFTActivityChainItems } from '../../../../types/core/chain/nft/NFTActivity';
import { getBlockTimestamp } from '../utils/transaction';
import { ACTIVITY } from '../constants/activity';
import { COIN_NAME } from '../constants/chain';
import { addActivityCollection, addActivityNFT, addActivityProfile } from '../utils/activity';
import { CollectionActivityChainItems } from '../../../../types/core/chain/collection';
import { RedeemableNFTAccountProps } from '../../../../types/core/account/profile';
import { getAccountStats, setAccountStats } from '../utils/account_stats';

export class DeliverSecretAsset extends BaseAsset<DeliverSecretProps> {
  public name = 'deliverSecret';
  public id = 2;

  // Define schema for asset
  public schema = deliverSecretAssetSchema;

  public validate(): void {
    // Validate your asset
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
    const timestamp = getBlockTimestamp(stateStore);

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

    const accountStats = await getAccountStats(stateStore, senderAccount.address.toString('hex'));
    const nftInServeRateIndex = accountStats.serveRate.items.findIndex(
      t =>
        Buffer.compare(t.id, nft.id) === 0 &&
        t.nonce === nft.redeem.velocity &&
        Buffer.compare(t.owner, nft.owner) === 0 &&
        t.status === 0,
    );

    if (nftInServeRateIndex === -1) {
      throw new Error('cannot find NFT in account stats serveRate items');
    }

    accountStats.serveRate.items[nftInServeRateIndex].status = 1;

    const serveRate = Number(
      (
        (accountStats.serveRate.items.filter(t => t.status === 1).length * 10000) /
        accountStats.serveRate.items.length
      ).toFixed(0),
    );

    accountStats.serveRate.score = serveRate;
    accountStats.momentSlot.push(nft.id);

    senderAccount.redeemableNft.serveRate = serveRate;
    await setAccountStats(stateStore, senderAccount.address.toString('hex'), accountStats);

    nft.redeem.secret.cipher = asset.cipher;
    nft.redeem.secret.signature.cipher = asset.signature.cipher;
    nft.redeem.secret.signature.plain = asset.signature.plain;
    nft.redeem.secret.sender = transaction.senderPublicKey;
    nft.redeem.status = 'ready';
    nft.redeem.nonce += 1;

    if (nft.price.amount > BigInt(0)) {
      await reducerHandler.invoke('token:credit', {
        address: senderAddress,
        amount: nft.price.amount,
      });
    }

    await addActivityProfile(stateStore, senderAddress.toString('hex'), {
      transaction: transaction.id,
      name: ACTIVITY.PROFILE.DELIVERSECRET,
      date: BigInt(timestamp),
      from: senderAddress,
      to: nft.owner,
      payload: nft.id,
      value: {
        amount: nft.price.amount,
        currency: nft.price.currency,
      },
    });

    await setNFTById(stateStore, nft.id.toString('hex'), nft);

    const index = senderAccount.redeemableNft.pending.findIndex(
      t => t.toString('hex') === asset.id,
    );
    if (index === -1) throw new Error('NFT id not found in account pending list');
    senderAccount.redeemableNft.pending.splice(index, 1);
    senderAccount.redeemableNft.momentSlot += 1;
    await stateStore.account.set(senderAddress, senderAccount);

    const nftActivity: NFTActivityChainItems = {
      transaction: transaction.id,
      date: BigInt(timestamp),
      name: ACTIVITY.NFT.SECRETDELIVERED,
      to: cryptography.getAddressFromPublicKey(nft.redeem.secret.recipient),
      value: {
        amount: BigInt(0),
        currency: COIN_NAME,
      },
    };
    await addActivityNFT(stateStore, nft.id.toString('hex'), nftActivity);

    const collectionActivity: CollectionActivityChainItems = {
      transaction: transaction.id,
      date: BigInt(timestamp),
      name: ACTIVITY.COLLECTION.SECRETDELIVERED,
      to: cryptography.getAddressFromPublicKey(nft.redeem.secret.recipient),
      value: {
        amount: BigInt(0),
        currency: COIN_NAME,
      },
      nfts: [nft.id],
    };
    await addActivityCollection(stateStore, nft.collectionId.toString('hex'), collectionActivity);
  }
}
