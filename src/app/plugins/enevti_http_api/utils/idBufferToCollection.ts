import { BaseChannel } from 'lisk-framework';
import {
  Collection,
  CollectionActivityChain,
  CollectionAsset,
} from '../../../../types/core/chain/collection';
import { NFT } from '../../../../types/core/chain/nft';
import { collectionSchema } from '../../../modules/redeemable_nft/schemas/chain/collection';
import addressBufferToPersona from './addressBufferToPersona';
import idBufferToNFT from './idBufferToNFT';

export default async function idBufferToCollection(
  channel: BaseChannel,
  id: Buffer,
): Promise<Collection> {
  const collection = await channel.invoke<CollectionAsset>('redeemableNft:getCollection', {
    id,
  });
  const retCollection = collection ?? ((collectionSchema.default as unknown) as CollectionAsset);
  const activityChain = await channel.invoke<CollectionActivityChain>(
    'redeemableNft:getActivityCollection',
    {
      id,
    },
  );
  const activity = await Promise.all(
    activityChain.items.map(async act => {
      const transaction = act.transaction.toString('hex');
      const to = await addressBufferToPersona(channel, act.to);
      const nft = await idBufferToNFT(channel, act.nft);
      const value = {
        amount: act.value.amount.toString(),
        currency: act.value.currency,
      };
      return { ...act, transaction, to, value, nft };
    }),
  );
  const social = {
    twitter: {
      link: retCollection.social.twitter,
      stat: 0,
    },
  };
  const minted = await Promise.all(
    retCollection.minted.map(async (item): Promise<NFT> => idBufferToNFT(channel, item)),
  );
  const creator = await addressBufferToPersona(channel, retCollection.creator);
  const stat = {
    ...retCollection.stat,
    owner: retCollection.stat.owner.length,
    floor: {
      amount: retCollection.stat.floor.amount.toString(),
      currency: retCollection.stat.floor.currency,
    },
    volume: {
      amount: retCollection.stat.volume.amount.toString(),
      currency: retCollection.stat.volume.currency,
    },
  };
  const minting = {
    ...retCollection.minting,
    total: retCollection.minting.total.length,
    available: retCollection.minting.available.length,
    price: {
      amount: retCollection.minting.price.amount.toString(),
      currency: retCollection.minting.price.currency,
    },
  };
  return {
    ...retCollection,
    id: retCollection.id.toString('hex'),
    activity,
    social,
    minted,
    creator,
    stat,
    minting,
  };
}
