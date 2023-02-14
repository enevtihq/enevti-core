import { Collection, CollectionBase } from 'enevti-types/chain/collection';
import { Moment, MomentBase } from 'enevti-types/chain/moment';
import { NFT, NFTBase } from 'enevti-types/chain/nft';

export const minimizeNFT = (nft: NFT): NFTBase => {
  const {
    collectionId,
    redeem,
    comment,
    clubs,
    description,
    createdOn,
    owner,
    creator,
    networkIdentifier,
    royalty,
    activity,
    moment,
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
    clubs,
    social,
    packSize,
    minted,
    creator,
    activity,
    moment,
    promoted,
    raffled,
    ...collectionBase
  } = collection;
  return collectionBase;
};

export const minimizeMoment = (moment: Moment): MomentBase => moment;
