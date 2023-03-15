import { StateStore, BaseModule } from 'lisk-framework';
import {
  ActivityGenesisChain,
  ActivityItemChain,
  ActivityListChain,
} from 'enevti-types/chain/activity';
import {
  AddActivityParam,
  GetActivitiesParam,
  GetActivityGenesisParam,
  GetActivityParam,
} from 'enevti-types/param/activity';
import { KEY_STRING_MAX_LENGTH, ID_BYTES_MAX_LENGTH } from 'enevti-types/constant/validation';
import { getActivity } from '../utils/item';
import { getActivities } from '../utils/list';
import { addActivity } from '../utils/add';
import { getActivityGenesis } from '../utils/genesis';

export function activityReducers(this: BaseModule) {
  return {
    getActivity: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<ActivityItemChain | undefined> => {
      const { id } = params as GetActivityParam;
      if (!Buffer.isBuffer(id)) {
        throw new Error('id must be a buffer');
      }
      if (id.length > ID_BYTES_MAX_LENGTH) {
        throw new Error(`maximum id length is ${ID_BYTES_MAX_LENGTH}`);
      }
      const activity = await getActivity(stateStore, id);
      return activity;
    },
    getActivities: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<ActivityListChain | undefined> => {
      const { identifier, key } = params as GetActivitiesParam;
      if (typeof identifier !== 'string') {
        throw new Error('identifier must be a string');
      }
      if (identifier.length > KEY_STRING_MAX_LENGTH) {
        throw new Error(`maximum identifier length is ${KEY_STRING_MAX_LENGTH}`);
      }
      if (typeof key !== 'string') {
        throw new Error('key must be a string');
      }
      if (key.length > KEY_STRING_MAX_LENGTH) {
        throw new Error(`maximum key length is ${KEY_STRING_MAX_LENGTH}`);
      }
      const activities = await getActivities(stateStore, identifier, key);
      return activities;
    },
    getActivityGenesis: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<ActivityGenesisChain | undefined> => {
      const { identifier, key } = params as GetActivityGenesisParam;
      if (typeof identifier !== 'string') {
        throw new Error('identifier must be a string');
      }
      if (identifier.length > KEY_STRING_MAX_LENGTH) {
        throw new Error(`maximum identifier length is ${KEY_STRING_MAX_LENGTH}`);
      }
      if (typeof key !== 'string') {
        throw new Error('key must be a string');
      }
      if (key.length > KEY_STRING_MAX_LENGTH) {
        throw new Error(`maximum key length is ${KEY_STRING_MAX_LENGTH}`);
      }
      const activitiyGenesis = await getActivityGenesis(stateStore, identifier, key);
      return activitiyGenesis;
    },
    addActivity: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<boolean> => {
      try {
        const { oldState, newState, payload } = params as AddActivityParam;
        if (typeof payload !== 'object') {
          throw new Error('payload must be an object');
        }
        if (typeof payload.key !== 'string') {
          throw new Error('payload.key must be a string');
        }
        if (payload.key.length > KEY_STRING_MAX_LENGTH + KEY_STRING_MAX_LENGTH + 1) {
          throw new Error(
            `maximum payload.key length is ${KEY_STRING_MAX_LENGTH + KEY_STRING_MAX_LENGTH + 1}`,
          );
        }
        if (typeof payload.type !== 'string') {
          throw new Error('payload.type must be a string');
        }
        if (payload.type.length > KEY_STRING_MAX_LENGTH) {
          throw new Error(`maximum payload.type length is ${KEY_STRING_MAX_LENGTH}`);
        }
        await addActivity(stateStore, payload, oldState, newState);
        return true;
      } catch {
        return false;
      }
    },
  };
}
