import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import * as seedrandom from 'seedrandom';
import { mintNftAssetSchema } from '../schemas/asset/mint_nft_asset';
import { RedeemableNFTAccountProps } from '../../../../types/core/account/profile';
import { MintNFTProps } from '../../../../types/core/asset/redeemable_nft/mint_nft_asset';
import { getCollectionById, setCollectionById } from '../utils/collection';
import { asyncForEach, getBlockTimestamp } from '../utils/transaction';
import { NFTTYPE } from '../constants/nft_type';
import { getNFTById, setNFTById } from '../utils/redeemable_nft';
import {
  CollectionActivityChainItems,
  CollectionAsset,
} from '../../../../types/core/chain/collection';
import { NFTActivityChainItems } from '../../../../types/core/chain/nft/NFTActivity';
import { ACTIVITY } from '../constants/activity';
import { addActivityCollection, addActivityNFT } from '../utils/activity';

function recordNFTMint(pnrg: seedrandom.PRNG, collection: CollectionAsset, boughtItem: Buffer[]) {
  const index = Math.floor(pnrg() * collection.minting.available.length);
  const item = collection.minting.available[index];
  boughtItem.unshift(item);
  collection.minting.available.splice(index, 1);
  collection.minted.push(item);
}

export class MintNftAsset extends BaseAsset<MintNFTProps> {
  public name = 'mintNft';
  public id = 1;

  // Define schema for asset
  public schema = mintNftAssetSchema;

  public validate({ asset }: ValidateAssetContext<MintNFTProps>): void {
    if (asset.quantity <= 0) {
      throw new Error(`asset.quantity must be greater than 0`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async apply({
    asset,
    transaction,
    stateStore,
    reducerHandler,
  }: ApplyAssetContext<MintNFTProps>): Promise<void> {
    const { senderAddress } = transaction;
    const collection = await getCollectionById(stateStore, asset.id);
    if (!collection) {
      throw new Error("NFT Collection doesn't exist");
    }

    const creatorAddress = collection.creator;
    const senderAccount = await stateStore.account.get<RedeemableNFTAccountProps>(senderAddress);
    const creatorAccount = await stateStore.account.get<RedeemableNFTAccountProps>(creatorAddress);
    const timestamp = getBlockTimestamp(stateStore);
    const rng = seedrandom(stateStore.chain.lastBlockHeaders[0].id.toString('hex'));

    if (collection.minting.expire !== -1) {
      if (timestamp > collection.minting.expire) {
        throw new Error('minting expired');
      }
    }

    if (collection.minting.available.length < asset.quantity * collection.packSize) {
      throw new Error('quantity unavailable');
    }

    const boughtItem: Buffer[] = [];
    for (let i = 0; i < asset.quantity; i += 1) {
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

      senderAccount.redeemableNft.owned.push(nft.id);
      if (nft.redeem.status === 'pending-secret') {
        creatorAccount.redeemableNft.pending.push(nft.id);
      }

      await reducerHandler.invoke('token:debit', {
        address: senderAddress,
        amount: collection.minting.price.amount,
      });

      if (nft.redeem.status !== 'pending-secret') {
        await reducerHandler.invoke('token:credit', {
          address: creatorAddress,
          amount: collection.minting.price.amount,
        });
      }
    });
    collection.stat.minted += boughtItem.length;
    creatorAccount.redeemableNft.nftSold += boughtItem.length;

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
