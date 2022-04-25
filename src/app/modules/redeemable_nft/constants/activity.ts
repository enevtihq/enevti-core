import { CollectionActivityName } from '../../../../types/core/chain/collection';
import { NFTActivityName } from '../../../../types/core/chain/nft/NFTActivity';

export const ACTIVITY: {
  NFT: Record<Uppercase<NFTActivityName>, NFTActivityName>;
  COLLECTION: Record<Uppercase<CollectionActivityName>, CollectionActivityName>;
} = {
  NFT: {
    MINT: 'mint',
    REDEEM: 'redeem',
  },
  COLLECTION: {
    CREATED: 'created',
  },
};
