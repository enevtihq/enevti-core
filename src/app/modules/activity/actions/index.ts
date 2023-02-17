import { ActivityItemChain, ActivityListChain } from 'enevti-types/chain/activity';
import { BaseModule } from 'lisk-framework';
import { accessActivity } from '../utils/item';
import { accessActivities } from '../utils/list';

export function activityActions(this: BaseModule) {
  return {
    getActivity: async (params): Promise<ActivityItemChain | undefined> => {
      const { id } = params as { id: Buffer };
      const activity = await accessActivity(this._dataAccess, id);
      return activity;
    },
    getActivities: async (params): Promise<ActivityListChain | undefined> => {
      const { identifier, key } = params as Record<string, string>;
      const activities = await accessActivities(this._dataAccess, identifier, key);
      return activities;
    },
  };
}
