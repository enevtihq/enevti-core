import { BaseAsset, ApplyAssetContext, ValidateAssetContext, cryptography } from 'lisk-sdk';
import * as seedrandom from 'seedrandom';
import { mintNftTypeQrAssetSchema } from '../schemas/asset/mint_nft_type_qr_asset';
import { RedeemableNFTAccountProps } from '../../../../types/core/account/profile';
import {
  MintNFTByQR,
  MintNFTByQRProps,
} from '../../../../types/core/asset/redeemable_nft/mint_nft_type_qr_asset';
import { getCollectionById, isMintingAvailable, setCollectionById } from '../utils/collection';
import { asyncForEach, getBlockTimestamp } from '../utils/transaction';
import { NFTTYPE } from '../constants/nft_type';
import { getNFTById, setNFTById } from '../utils/redeemable_nft';
import {
  CollectionActivityChainItems,
  CollectionAsset,
} from '../../../../types/core/chain/collection';
import { NFTActivityChainItems } from '../../../../types/core/chain/nft/NFTActivity';
import { ACTIVITY } from '../constants/activity';
import { addActivityCollection, addActivityNFT, addActivityProfile } from '../utils/activity';
import { getAccountStats, setAccountStats } from '../utils/account_stats';

function recordNFTMint(pnrg: seedrandom.PRNG, collection: CollectionAsset, boughtItem: Buffer[]) {
  const index = Math.floor(pnrg() * collection.minting.available.length);
  const item = collection.minting.available[index];
  boughtItem.unshift(item);
  collection.minting.available.splice(index, 1);
  collection.minted.unshift(item);
}

export class MintNftTypeQrAsset extends BaseAsset {
  public name = 'mintNftTypeQr';
  public id = 3;

  // Define schema for asset
  public schema = mintNftTypeQrAssetSchema;

  public validate({ asset }: ValidateAssetContext<MintNFTByQRProps>): void {
    if (asset.body.length === 0) {
      throw new Error(`asset.body cannot be empty`);
    }
    if (asset.signature.length === 0) {
      throw new Error(`asset.signature cannot be empty`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async apply({
    asset,
    transaction,
    stateStore,
    reducerHandler,
  }: ApplyAssetContext<MintNFTByQRProps>): Promise<void> {
    const { senderAddress } = transaction;
    const plainPayload = Buffer.from(asset.body, 'base64').toString();
    const { id, quantity, nonce, publicKey } = JSON.parse(plainPayload) as MintNFTByQR;

    const collection = await getCollectionById(stateStore, id);
    if (!collection) {
      throw new Error('NFT Collection doesnt exist');
    }

    if (!['qr'].includes(collection.mintingType)) {
      throw new Error(`invalid mintingType on specified collection`);
    }

    if (collection.stat.minted !== nonce) {
      throw new Error(`invalid nonce on asset payload`);
    }

    if (
      !cryptography.verifyData(
        cryptography.stringToBuffer(asset.body),
        Buffer.from(asset.signature, 'hex'),
        Buffer.from(publicKey, 'hex'),
      )
    ) {
      throw new Error(`invalid signature, make sure you get valid signature from creator`);
    }

    const senderAccount = await stateStore.account.get<RedeemableNFTAccountProps>(senderAddress);
    const creatorAddress = collection.creator;
    const creatorAccount =
      creatorAddress.compare(senderAddress) === 0
        ? senderAccount
        : await stateStore.account.get<RedeemableNFTAccountProps>(creatorAddress);
    const timestamp = getBlockTimestamp(stateStore);
    const rng = seedrandom(stateStore.chain.lastBlockHeaders[0].id.toString('hex'));

    if (!isMintingAvailable(collection, timestamp)) {
      throw new Error('minting unavailable');
    }

    if (collection.minting.available.length < quantity * collection.packSize) {
      throw new Error('quantity unavailable');
    }

    const boughtItem: Buffer[] = [];
    for (let i = 0; i < quantity; i += 1) {
      switch (collection.collectionType) {
        case NFTTYPE.ONEKIND:
        case NFTTYPE.UPGRADABLE:
          if (collection.packSize === 1) {
            recordNFTMint(rng, collection, boughtItem);
          } else {
            throw new Error('invalid packsize, should be 1');
          }
          break;
        case NFTTYPE.PACKED:
          for (let j = 0; j < collection.packSize; j += 1) {
            recordNFTMint(rng, collection, boughtItem);
          }
          break;
        default:
          throw new Error('FATAL: unkown collection type');
      }
    }

    const accountStats = await getAccountStats(stateStore, creatorAccount.address.toString('hex'));

    await asyncForEach<Buffer>(boughtItem, async item => {
      const nft = await getNFTById(stateStore, item.toString('hex'));
      if (!nft) {
        throw new Error('unknown NFT in collection');
      }
      nft.owner = senderAddress;
      if (nft.redeem.status === 'pending-secret')
        nft.redeem.secret.recipient = transaction.senderPublicKey;
      await setNFTById(stateStore, nft.id.toString('hex'), nft);

      const activity: NFTActivityChainItems = {
        transaction: transaction.id,
        date: BigInt(timestamp),
        name: ACTIVITY.NFT.MINT,
        to: senderAddress,
        value: {
          amount: collection.minting.price.amount,
          currency: collection.minting.price.currency,
        },
      };
      await addActivityNFT(stateStore, nft.id.toString('hex'), activity);

      senderAccount.redeemableNft.owned.unshift(nft.id);
      if (nft.redeem.status === 'pending-secret') {
        creatorAccount.redeemableNft.pending.unshift(nft.id);
      }

      if (collection.minting.price.amount > BigInt(0)) {
        await reducerHandler.invoke('token:debit', {
          address: senderAddress,
          amount: collection.minting.price.amount,
        });
      }

      await addActivityProfile(stateStore, senderAddress.toString('hex'), {
        transaction: transaction.id,
        name: ACTIVITY.PROFILE.MINTNFT,
        date: BigInt(timestamp),
        from: senderAddress,
        to: creatorAddress,
        payload: nft.id,
        value: {
          amount: collection.minting.price.amount,
          currency: collection.minting.price.currency,
        },
      });

      if (nft.redeem.status !== 'pending-secret') {
        if (collection.minting.price.amount > BigInt(0)) {
          await reducerHandler.invoke('token:credit', {
            address: creatorAddress,
            amount: collection.minting.price.amount,
          });
        }
        await addActivityProfile(stateStore, creatorAddress.toString('hex'), {
          transaction: transaction.id,
          name: ACTIVITY.PROFILE.NFTSALE,
          date: BigInt(timestamp),
          from: senderAddress,
          to: creatorAddress,
          payload: nft.id,
          value: {
            amount: collection.minting.price.amount,
            currency: collection.minting.price.currency,
          },
        });
      }

      accountStats.nftSold.unshift(nft.id);
      accountStats.serveRate.items.unshift({ id: nft.id, nonce: nft.redeem.count, status: 0 });
    });

    const serveRate = Number(
      (
        (accountStats.serveRate.items.filter(t => t.status === 1).length * 10000) /
        accountStats.serveRate.items.length
      ).toFixed(0),
    );

    collection.stat.minted += boughtItem.length;
    creatorAccount.redeemableNft.nftSold += boughtItem.length;
    creatorAccount.redeemableNft.serveRate = serveRate;

    accountStats.serveRate.score = serveRate;
    await setAccountStats(stateStore, creatorAccount.address.toString('hex'), accountStats);

    const collectionActivity: CollectionActivityChainItems = {
      transaction: transaction.id,
      date: BigInt(timestamp),
      name: ACTIVITY.COLLECTION.MINTED,
      to: senderAddress,
      value: {
        amount: collection.minting.price.amount,
        currency: collection.minting.price.currency,
      },
      nfts: boughtItem,
    };
    await addActivityCollection(stateStore, collection.id.toString('hex'), collectionActivity);

    await setCollectionById(stateStore, collection.id.toString('hex'), collection);
    await stateStore.account.set(creatorAddress, creatorAccount);
    await stateStore.account.set(senderAddress, senderAccount);
  }
}
