import { BaseChannel } from 'lisk-framework';
import { CollectionAsset } from '../../../../types/core/chain/collection';
import { NFT } from '../../../../types/core/chain/nft';
import addressBufferToPersona from './addressBufferToPersona';
import idBufferToNFT from './idBufferToNFT';

export default async function collectionChainToUI(
  channel: BaseChannel,
  collection: CollectionAsset,
) {
  const social = {
    twitter: {
      link: collection.social.twitter,
      stat: 0,
    },
  };
  const minted = await Promise.all(
    collection.minted.map(async (item): Promise<NFT> => {
      const nft = await idBufferToNFT(channel, item);
      if (!nft) throw new Error('NFT not found while processing minted');
      return nft;
    }),
  );
  const creator = await addressBufferToPersona(channel, collection.creator);
  const stat = {
    ...collection.stat,
    owner: collection.stat.owner.length,
    floor: {
      amount: collection.stat.floor.amount.toString(),
      currency: collection.stat.floor.currency,
    },
    volume: {
      amount: collection.stat.volume.amount.toString(),
      currency: collection.stat.volume.currency,
    },
  };
  const minting = {
    ...collection.minting,
    total: collection.minting.total.length,
    available: collection.minting.available.length,
    price: {
      amount: collection.minting.price.amount.toString(),
      currency: collection.minting.price.currency,
    },
  };
  return {
    id: collection.id.toString('hex'),
    social,
    minted,
    creator,
    stat,
    minting,
  };
}