import { StateStore, GenesisConfig, BaseModule } from 'lisk-framework';
import { SocialRaffleGenesisConfig } from 'enevti-types/chain/config/SocialRaffleGenesisConfig';
import { NFTAsset } from 'enevti-types/chain/nft';
import { CollectionAsset } from 'enevti-types/chain/collection';
import { MintNFTUtilsFunctionProps, mintNFT } from '../utils/mint';
import { getNFTById } from '../utils/redeemable_nft';
import { getCollectionById } from '../utils/collection';

export function redeemableNftReducers(this: BaseModule) {
  return {
    getSocialRaffleConfig: async (
      _params: Record<string, unknown>,
      _stateStore: StateStore,
      // eslint-disable-next-line @typescript-eslint/require-await
    ): Promise<SocialRaffleGenesisConfig['socialRaffle']> => {
      const { socialRaffle } = this.config as GenesisConfig & SocialRaffleGenesisConfig;
      return socialRaffle;
    },
    mintNFT: async (params: Record<string, unknown>, stateStore: StateStore): Promise<Buffer[]> => {
      const arg = params as MintNFTUtilsFunctionProps;
      const boughtItem = await mintNFT({ ...arg, stateStore });
      return boughtItem;
    },
    getNFT: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<NFTAsset | undefined> => {
      const { id } = params as Record<string, string>;
      const nft = await getNFTById(stateStore, id);
      return nft ?? undefined;
    },
    getCollection: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<CollectionAsset | undefined> => {
      const { id } = params as Record<string, string>;
      const collection = await getCollectionById(stateStore, id);
      return collection ?? undefined;
    },
  };
}
