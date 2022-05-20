import { Collection, CollectionBase } from '../../../../../types/core/chain/collection';
import { NFT, NFTBase } from '../../../../../types/core/chain/nft';

export const minimizeNFT = (nft: NFT): NFTBase => {
  const {
    collectionId,
    redeem,
    comment,
    description,
    createdOn,
    creator,
    networkIdentifier,
    royalty,
    activity,
    ...nftBase
  } = nft;
  return nftBase;
};

export const minimizeCollection = (collection: Collection): CollectionBase => {
  const {
    collectionType,
    mintingType,
    description,
    symbol,
    createdOn,
    like,
    comment,
    social,
    packSize,
    minted,
    creator,
    activity,
    promoted,
    ...collectionBase
  } = collection;
  return collectionBase;
};
