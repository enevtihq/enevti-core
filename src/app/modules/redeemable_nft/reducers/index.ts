import { StateStore, GenesisConfig, BaseModule } from 'lisk-framework';
import { SocialRaffleGenesisConfig } from 'enevti-types/chain/config/SocialRaffleGenesisConfig';
import { MintNFTUtilsFunctionProps, mintNFT } from '../utils/mint';

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
  };
}
