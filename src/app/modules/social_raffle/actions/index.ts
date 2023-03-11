import {
  SocialRaffleBlockRecord,
  SocialRaffleChain,
  SocialRaffleCollectionChain,
} from 'enevti-types/chain/social_raffle';
import { ID_BYTES_MAX_LENGTH } from 'enevti-types/constant/validation';
import { GetCollectionRaffleConfig, GetRecordParam } from 'enevti-types/param/social_raffle';
import { BaseModule, GenesisConfig } from 'lisk-framework';
import { accessSocialRaffleBlockRecord } from '../utils/block';
import { accessCollectionRaffleConfig } from '../utils/collectionConfig';
import { accessSocialRaffleState } from '../utils/state';

export function socialRaffleActions(this: BaseModule) {
  return {
    // eslint-disable-next-line @typescript-eslint/require-await
    getConfig: async (_params): Promise<GenesisConfig> => this.config,
    getCollectionRaffleConfig: async (params): Promise<SocialRaffleCollectionChain | undefined> => {
      const { id } = params as GetCollectionRaffleConfig;
      if (!Buffer.isBuffer(id)) {
        throw new Error('id must be a buffer');
      }
      if (id.length > ID_BYTES_MAX_LENGTH) {
        throw new Error(`maximum id length is ${ID_BYTES_MAX_LENGTH}`);
      }
      const collectionConfig = await accessCollectionRaffleConfig(this._dataAccess, id);
      return collectionConfig;
    },
    getState: async (_params): Promise<SocialRaffleChain> => {
      const state = await accessSocialRaffleState(this._dataAccess);
      return state;
    },
    getRecord: async (params): Promise<SocialRaffleBlockRecord> => {
      const { height } = params as GetRecordParam;
      if (typeof height !== 'number') {
        throw new Error('height must be a number');
      }
      const record = await accessSocialRaffleBlockRecord(this._dataAccess, height);
      return record;
    },
  };
}
