import {
  EngagementActivityName,
  ProfileActivityName,
} from '../../../../types/core/account/profile';
import { CollectionActivityName } from '../../../../types/core/chain/collection';
import { NFTActivityName } from '../../../../types/core/chain/nft/NFTActivity';

export const ACTIVITY: {
  NFT: Record<Uppercase<NFTActivityName>, NFTActivityName>;
  COLLECTION: Record<Uppercase<CollectionActivityName>, CollectionActivityName>;
  PROFILE: Record<Uppercase<ProfileActivityName>, ProfileActivityName>;
  ENGAGEMENT: Record<Uppercase<EngagementActivityName>, EngagementActivityName>;
} = {
  NFT: {
    MINT: 'mint',
    REDEEM: 'redeem',
    SECRETDELIVERED: 'secretDelivered',
  },
  COLLECTION: {
    CREATED: 'created',
    MINTED: 'minted',
    SECRETDELIVERED: 'secretDelivered',
  },
  PROFILE: {
    TOKENSENT: 'tokenSent',
    TOKENRECEIVED: 'tokenReceived',
    REGISTERUSERNAME: 'registerUsername',
    ADDSTAKE: 'addStake',
    SELFSTAKE: 'selfStake',
    CREATENFT: 'createNFT',
    MINTNFT: 'mintNFT',
    NFTSALE: 'NFTSale',
    DELIVERSECRET: 'deliverSecret',
  },
  ENGAGEMENT: {
    LIKENFT: 'likeNft',
    LIKECOLLECTION: 'likeCollection',
    COMMENTNFT: 'commentNft',
    COMMENTCOLLECTION: 'commentCollection',
    REPLY: 'reply',
  },
};
