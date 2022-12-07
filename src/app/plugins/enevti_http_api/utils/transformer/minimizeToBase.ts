import { Collection, CollectionBase } from '../../../../../types/core/chain/collection';
import { Moment, MomentBase } from '../../../../../types/core/chain/moment';
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

export const minimizeMoment = (moment: Moment): MomentBase => {
  const {
    nftId,
    owner,
    creator,
    data,
    comment,
    clubs,
    createdOn,
    activity,
    ...momentBase
  } = moment;
  return momentBase;
};
