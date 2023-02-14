import * as seedrandom from 'seedrandom';
import { StateStore, ReducerHandler, cryptography } from 'lisk-sdk';
import { RedeemableNFTAccountProps } from 'enevti-types/account/profile';
import { CollectionActivityChainItems, CollectionAsset } from 'enevti-types/chain/collection';
import { NFTActivityChainItems } from 'enevti-types/chain/nft/NFTActivity';
import { ACTIVITY } from '../constants/activity';
import { NFTTYPE } from '../constants/nft_type';
import { getAccountStats, setAccountStats } from './account_stats';
import { addActivityNFT, addActivityProfile, addActivityCollection } from './activity';
import { getCollectionById, isMintingAvailable, setCollectionById } from './collection';
import { getNFTById, setNFTById } from './redeemable_nft';
import { getBlockTimestamp, asyncForEach } from './transaction';

export type MintNFTUtilsFunctionProps = {
  id: string;
  quantity: number;
  transactionId: Buffer;
  senderPublicKey: Buffer;
  type: 'normal' | 'raffle';
  reducerHandler: ReducerHandler;
};

export async function mintNFT({
  id,
  quantity,
  transactionId,
  senderPublicKey,
  type,
  stateStore,
  reducerHandler,
}: MintNFTUtilsFunctionProps & { stateStore: StateStore }): Promise<Buffer[]> {
  const senderAddress = cryptography.getAddressFromPublicKey(senderPublicKey);
  const collection = await getCollectionById(stateStore, id);
  if (!collection) {
    throw new Error('NFT Collection doesnt exist');
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
  const senderAccountStats =
    Buffer.compare(creatorAddress, senderAddress) === 0
      ? accountStats
      : await getAccountStats(stateStore, senderAccount.address.toString('hex'));

  await asyncForEach<Buffer>(boughtItem, async item => {
    const nft = await getNFTById(stateStore, item.toString('hex'));
    if (!nft) {
      throw new Error('unknown NFT in collection');
    }
    nft.owner = senderAddress;
    nft.redeem.velocity += 1;
    nft.redeem.count = 0;
    if (nft.redeem.status === 'pending-secret') nft.redeem.secret.recipient = senderPublicKey;
    await setNFTById(stateStore, nft.id.toString('hex'), nft);

    const activity: NFTActivityChainItems = {
      transaction: transactionId,
      date: BigInt(timestamp),
      name: type === 'raffle' ? ACTIVITY.NFT.RAFFLED : ACTIVITY.NFT.MINT,
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
      senderAccount.redeemableNft.momentSlot += 1;
      senderAccountStats.momentSlot.push(nft.id);
    }

    if (collection.minting.price.amount > BigInt(0)) {
      await reducerHandler.invoke('token:debit', {
        address: senderAddress,
        amount: collection.minting.price.amount,
      });
    }

    await addActivityProfile(stateStore, senderAddress.toString('hex'), {
      transaction: transactionId,
      name: type === 'raffle' ? ACTIVITY.PROFILE.WINRAFFLE : ACTIVITY.PROFILE.MINTNFT,
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
        transaction: transactionId,
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

    if (type === 'normal') {
      accountStats.nftSold.unshift(nft.id);
    }

    if (nft.utility === 'videocall') {
      accountStats.serveRate.items.unshift({
        id: nft.id,
        owner: senderAddress,
        nonce: nft.redeem.velocity,
        status: 1,
      });
    } else {
      accountStats.serveRate.items.unshift({
        id: nft.id,
        owner: senderAddress,
        nonce: nft.redeem.velocity,
        status: 0,
      });
    }
  });

  const serveRate = Number(
    (
      (accountStats.serveRate.items.filter(t => t.status === 1).length * 10000) /
      accountStats.serveRate.items.length
    ).toFixed(0),
  );

  creatorAccount.redeemableNft.serveRate = serveRate;
  if (type === 'normal') {
    creatorAccount.redeemableNft.nftSold += boughtItem.length;
  } else if (type === 'raffle') {
    accountStats.raffled.unshift(collection.id);
    creatorAccount.redeemableNft.raffled += 1;
  }

  accountStats.serveRate.score = serveRate;
  await setAccountStats(stateStore, creatorAccount.address.toString('hex'), accountStats);
  if (Buffer.compare(creatorAddress, senderAddress) !== 0) {
    await setAccountStats(stateStore, senderAccount.address.toString('hex'), senderAccountStats);
  }

  collection.stat.minted += boughtItem.length;
  if (collection.stat.owner.findIndex(o => Buffer.compare(o, senderAddress) === 0) === -1) {
    collection.stat.owner.push(senderAddress);
  }

  const collectionActivity: CollectionActivityChainItems = {
    transaction: transactionId,
    date: BigInt(timestamp),
    name: type === 'raffle' ? ACTIVITY.COLLECTION.RAFFLED : ACTIVITY.COLLECTION.MINTED,
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

  return boughtItem;
}

function recordNFTMint(pnrg: seedrandom.PRNG, collection: CollectionAsset, boughtItem: Buffer[]) {
  const index = Math.floor(pnrg() * collection.minting.available.length);
  const item = collection.minting.available[index];
  boughtItem.unshift(item);
  collection.minting.available.splice(index, 1);
  collection.minted.unshift(item);
}
