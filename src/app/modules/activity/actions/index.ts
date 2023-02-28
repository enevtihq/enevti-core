import {
  ActivityGenesisChain,
  ActivityItemChain,
  ActivityListChain,
} from 'enevti-types/chain/activity';
import {
  GetActivitiesParam,
  GetActivityGenesisParam,
  GetActivityParam,
} from 'enevti-types/param/activity';
import { BaseModule } from 'lisk-framework';
import { IDENTIFIER_MAX_LENGTH, ID_MAX_LENGTH, KEY_MAX_LENGTH } from '../constants/limit';
import { accessActivityGenesis } from '../utils/genesis';
import { accessActivity } from '../utils/item';
import { accessActivities } from '../utils/list';

export function activityActions(this: BaseModule) {
  return {
    getActivity: async (params): Promise<ActivityItemChain | undefined> => {
      const { id } = params as GetActivityParam;
      if (!Buffer.isBuffer(id)) {
        throw new Error('id must be a buffer');
      }
      if (id.length > ID_MAX_LENGTH) {
        throw new Error(`maximum id length is ${ID_MAX_LENGTH}`);
      }
      const activity = await accessActivity(this._dataAccess, id);
      return activity;
    },
    getActivities: async (params): Promise<ActivityListChain | undefined> => {
      const { identifier, key } = params as GetActivitiesParam;
      if (typeof identifier !== 'string') {
        throw new Error('identifier must be a string');
      }
      if (identifier.length > IDENTIFIER_MAX_LENGTH) {
        throw new Error(`maximum identifier length is ${IDENTIFIER_MAX_LENGTH}`);
      }
      if (typeof key !== 'string') {
        throw new Error('key must be a string');
      }
      if (key.length > KEY_MAX_LENGTH) {
        throw new Error(`maximum key length is ${KEY_MAX_LENGTH}`);
      }
      const activities = await accessActivities(this._dataAccess, identifier, key);
      return activities;
    },
    getActivityGenesis: async (params): Promise<ActivityGenesisChain | undefined> => {
      const { identifier, key } = params as GetActivityGenesisParam;
      if (typeof identifier !== 'string') {
        throw new Error('identifier must be a string');
      }
      if (identifier.length > IDENTIFIER_MAX_LENGTH) {
        throw new Error(`maximum identifier length is ${IDENTIFIER_MAX_LENGTH}`);
      }
      if (typeof key !== 'string') {
        throw new Error('key must be a string');
      }
      if (key.length > KEY_MAX_LENGTH) {
        throw new Error(`maximum key length is ${KEY_MAX_LENGTH}`);
      }
      const activityGenesis = await accessActivityGenesis(this._dataAccess, identifier, key);
      return activityGenesis;
    },
  };
}
