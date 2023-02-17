import { StateStore, BaseModule } from 'lisk-framework';
import { ActivityItemChain, ActivityListChain } from 'enevti-types/chain/activity';
import { getActivity } from '../utils/item';
import { getActivities } from '../utils/list';
import { addActivity, AddActivityPayload } from '../utils/add';

export function activityReducers(this: BaseModule) {
  return {
    getActivity: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<ActivityItemChain | undefined> => {
      const { id } = params as { id: Buffer };
      const activity = await getActivity(stateStore, id);
      return activity;
    },
    getActivities: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<ActivityListChain | undefined> => {
      const { identifier, key } = params as Record<string, string>;
      const activities = await getActivities(stateStore, identifier, key);
      return activities;
    },
    addActivity: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<boolean> => {
      try {
        const { oldState, newState, payload } = params as {
          oldState: Record<string, unknown>;
          newState: Record<string, unknown>;
          payload: AddActivityPayload;
        };
        await addActivity(stateStore, oldState, newState, payload);
        return true;
      } catch {
        return false;
      }
    },
  };
}
