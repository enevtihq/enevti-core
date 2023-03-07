import { StateStore, BaseModule, GenesisConfig } from 'lisk-framework';
import {
  SocialRaffleBlockRecord,
  SocialRaffleChain,
  SocialRaffleCollectionChain,
} from 'enevti-types/chain/social_raffle';
import {
  GetCollectionRaffleConfig,
  GetRecordParam,
  SetCollectionRaffleConfig,
} from 'enevti-types/param/social_raffle';
import { getSocialRaffleState } from '../utils/state';
import { getSocialRaffleBlockRecord } from '../utils/block';
import { ID_MAX_LENGTH } from '../constants/limit';
import { getCollectionRaffleConfig, setCollectionRaffleConfig } from '../utils/collectionConfig';

export function socialRaffleReducers(this: BaseModule) {
  return {
    getConfig: async (
      _params: Record<string, unknown>,
      _stateStore: StateStore,
      // eslint-disable-next-line @typescript-eslint/require-await
    ): Promise<GenesisConfig> => this.config,
    getCollectionRaffleConfig: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<SocialRaffleCollectionChain | undefined> => {
      const { id } = params as GetCollectionRaffleConfig;
      if (!Buffer.isBuffer(id)) {
        throw new Error('id must be a buffer');
      }
      if (id.length > ID_MAX_LENGTH) {
        throw new Error(`maximum id length is ${ID_MAX_LENGTH}`);
      }
      const collectionConfig = await getCollectionRaffleConfig(stateStore, id);
      return collectionConfig;
    },
    getState: async (
      _params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<SocialRaffleChain> => {
      const state = await getSocialRaffleState(stateStore);
      return state;
    },
    getRecord: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<SocialRaffleBlockRecord> => {
      const { height } = params as GetRecordParam;
      if (typeof height !== 'number') {
        throw new Error('height must be a number');
      }
      const record = await getSocialRaffleBlockRecord(stateStore, height);
      return record;
    },
    setCollectionRaffleConfig: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<boolean> => {
      try {
        const { id, activated } = params as SetCollectionRaffleConfig;
        if (!Buffer.isBuffer(id)) {
          throw new Error('id must be a buffer');
        }
        if (id.length > ID_MAX_LENGTH) {
          throw new Error(`maximum id length is ${ID_MAX_LENGTH}`);
        }
        if (typeof activated !== 'boolean') {
          throw new Error('activated must be a boolean');
        }
        await setCollectionRaffleConfig(stateStore, id, { activated });
        return true;
      } catch {
        return false;
      }
    },
  };
}
