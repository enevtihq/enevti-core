import {
  ActivityGenesisChain,
  ActivityItemChain,
  ActivityListChain,
} from 'enevti-types/chain/activity';
import { BaseModule } from 'lisk-framework';
import { accessActivityGenesis } from '../utils/genesis';
import { accessActivity } from '../utils/item';
import { accessActivities } from '../utils/list';

export function activityActions(this: BaseModule) {
  return {
    getActivity: async (params): Promise<ActivityItemChain | undefined> => {
      const { id } = params as { id: Buffer };
      if (!Buffer.isBuffer(id)) {
        throw new Error('id must be a buffer');
      }
      const activity = await accessActivity(this._dataAccess, id);
      return activity;
    },
    getActivities: async (params): Promise<ActivityListChain | undefined> => {
      const { identifier, key } = params as Record<string, string>;
      if (typeof identifier !== 'string') {
        throw new Error('identifier must be a string');
      }
      if (typeof key !== 'string') {
        throw new Error('key must be a string');
      }
      const activities = await accessActivities(this._dataAccess, identifier, key);
      return activities;
    },
    getActivityGenesis: async (params): Promise<ActivityGenesisChain | undefined> => {
      const { identifier, key } = params as Record<string, string>;
      if (typeof identifier !== 'string') {
        throw new Error('identifier must be a string');
      }
      if (typeof key !== 'string') {
        throw new Error('key must be a string');
      }
      const activityGenesis = await accessActivityGenesis(this._dataAccess, identifier, key);
      return activityGenesis;
    },
  };
}
