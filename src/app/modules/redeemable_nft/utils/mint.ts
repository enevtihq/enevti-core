import * as seedrandom from 'seedrandom';
import { StateStore, ReducerHandler, cryptography } from 'lisk-sdk';
import { RedeemableNFTAccountProps } from 'enevti-types/account/profile';
import { CollectionAsset } from 'enevti-types/chain/collection';
import { AddCountParam } from 'enevti-types/param/count';
import { AddActivityParam } from 'enevti-types/param/activity';
import { ACTIVITY } from '../constants/activity';
import { NFTTYPE } from '../constants/nft_type';
import { getCollectionById, isMintingAvailable, setCollectionById } from './collection';
import { getNFTById, setNFTById } from './redeemable_nft';
import { getBlockTimestamp, asyncForEach } from './transaction';
import { getMomentSlot, setMomentSlot } from './momentSlot';
import { getServeRate, setServeRate } from './serveRate';

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

  // TODO: should be in separate module, nft_minting module
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
          await recordNFTMint(reducerHandler, rng, transactionId, type, collection, boughtItem);
        } else {
          throw new Error('invalid packsize, should be 1');
        }
        break;
      case NFTTYPE.PACKED:
        for (let j = 0; j < collection.packSize; j += 1) {
          await recordNFTMint(reducerHandler, rng, transactionId, type, collection, boughtItem);
        }
        break;
      default:
        throw new Error('FATAL: unkown collection type');
    }
  }

  const accountServeRate = (await getServeRate(stateStore, creatorAccount.address)) ?? {
    score: 0,
    items: [],
  };

  const senderMomentSlot = (await getMomentSlot(stateStore, senderAccount.address)) ?? {
    items: [],
  };

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

    await reducerHandler.invoke('activity:addActivity', {
      newState: nft as unknown,
      oldState: await getNFTById(stateStore, item.toString('hex')),
      payload: {
        key: `nft:${nft.id.toString('hex')}`,
        type: type === 'raffle' ? ACTIVITY.NFT.RAFFLED : ACTIVITY.NFT.MINT,
        transaction: transactionId,
        amount: collection.minting.price.amount,
      },
    } as AddActivityParam);

    senderAccount.redeemableNft.owned.unshift(nft.id);
    if (nft.redeem.status === 'pending-secret') {
      creatorAccount.redeemableNft.pending.unshift(nft.id);
      senderAccount.redeemableNft.momentSlot += 1;
      senderMomentSlot.items.push(nft.id);
    }

    const senderBalanceOld = await reducerHandler.invoke<bigint>('token:getBalance', {
      address: senderAddress,
    });
    let senderBalanceNew = senderBalanceOld;
    if (collection.minting.price.amount > BigInt(0)) {
      senderBalanceNew -= collection.minting.price.amount;
      await reducerHandler.invoke('token:debit', {
        address: senderAddress,
        amount: collection.minting.price.amount,
      });
    }

    await reducerHandler.invoke('activity:addActivity', {
      newState: {
        token: { balance: senderBalanceNew },
        redeemableNft: { ...senderAccount.redeemableNft },
      },
      oldState: {
        token: { balance: senderBalanceOld },
        redeemableNft: {
          ...(await stateStore.account.get<RedeemableNFTAccountProps>(senderAddress)),
        },
      },
      payload: {
        key: `profile:${senderAddress.toString('hex')}`,
        type: type === 'raffle' ? ACTIVITY.PROFILE.WINRAFFLE : ACTIVITY.PROFILE.MINTNFT,
        transaction: transactionId,
        amount: collection.minting.price.amount,
        payload: nft.id,
      },
    } as AddActivityParam);

    if (nft.redeem.status !== 'pending-secret') {
      const creatorBalanceOld = await reducerHandler.invoke<bigint>('token:getBalance', {
        address: creatorAddress,
      });
      let creatorBalanceNew = creatorBalanceOld;
      if (collection.minting.price.amount > BigInt(0)) {
        creatorBalanceNew += collection.minting.price.amount;
        await reducerHandler.invoke('token:credit', {
          address: creatorAddress,
          amount: collection.minting.price.amount,
        });
      }
      await reducerHandler.invoke('activity:addActivity', {
        newState: {
          token: { balance: creatorBalanceNew },
          redeemableNft: { ...creatorAccount.redeemableNft },
        },
        oldState: {
          token: { balance: creatorBalanceOld },
          redeemableNft: {
            ...(await stateStore.account.get<RedeemableNFTAccountProps>(creatorAddress)),
          },
        },
        payload: {
          key: `profile:${creatorAddress.toString('hex')}`,
          type: ACTIVITY.PROFILE.NFTSALE,
          transaction: transactionId,
          amount: collection.minting.price.amount,
          payload: nft.id,
        },
      } as AddActivityParam);
    }

    if (type === 'normal') {
      await reducerHandler.invoke('count:addCount', {
        module: 'nftSold',
        key: 'mint',
        address: creatorAccount.address,
        item: nft.id,
      } as AddCountParam);
    }

    if (nft.utility === 'videocall') {
      accountServeRate.items.unshift({
        id: nft.id,
        owner: senderAddress,
        nonce: nft.redeem.velocity,
        status: 1,
      });
    } else {
      accountServeRate.items.unshift({
        id: nft.id,
        owner: senderAddress,
        nonce: nft.redeem.velocity,
        status: 0,
      });
    }
  });

  const serveRate = Number(
    (
      (accountServeRate.items.filter(t => t.status === 1).length * 10000) /
      accountServeRate.items.length
    ).toFixed(0),
  );

  creatorAccount.redeemableNft.serveRate = serveRate;
  if (type === 'normal') {
    creatorAccount.redeemableNft.nftSold += boughtItem.length;
  } else if (type === 'raffle') {
    creatorAccount.redeemableNft.raffled += 1;
  }

  accountServeRate.score = serveRate;
  await setServeRate(stateStore, creatorAccount.address, accountServeRate);
  await setMomentSlot(stateStore, senderAccount.address, senderMomentSlot);

  collection.stat.minted += boughtItem.length;
  if (collection.stat.owner.findIndex(o => Buffer.compare(o, senderAddress) === 0) === -1) {
    collection.stat.owner.push(senderAddress);
  }

  await setCollectionById(stateStore, collection.id.toString('hex'), collection);
  await stateStore.account.set(creatorAddress, creatorAccount);
  await stateStore.account.set(senderAddress, senderAccount);

  return boughtItem;
}

async function recordNFTMint(
  reducerHandler: ReducerHandler,
  pnrg: seedrandom.PRNG,
  transactionId: Buffer,
  type: string,
  collection: CollectionAsset,
  boughtItem: Buffer[],
) {
  const oldCollection = { ...collection };
  const index = Math.floor(pnrg() * collection.minting.available.length);
  const item = collection.minting.available[index];

  boughtItem.unshift(item);
  collection.minting.available.splice(index, 1);
  collection.minted.unshift(item);

  await reducerHandler.invoke('activity:addActivity', {
    newState: collection as unknown,
    oldState: oldCollection,
    payload: {
      key: `collection:${collection.id.toString('hex')}`,
      type: type === 'raffle' ? ACTIVITY.COLLECTION.RAFFLED : ACTIVITY.COLLECTION.MINTED,
      transaction: transactionId,
      amount: collection.minting.price.amount,
      payload: item,
    },
  } as AddActivityParam);
}
