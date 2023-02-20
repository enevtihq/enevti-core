import { StateStore, BaseModule } from 'lisk-framework';
import {
  ActivityGenesisChain,
  ActivityItemChain,
  ActivityListChain,
} from 'enevti-types/chain/activity';
import { getActivity } from '../utils/item';
import { getActivities } from '../utils/list';
import { addActivity, AddActivityPayload } from '../utils/add';
import { getActivityGenesis } from '../utils/genesis';
import {
  IDENTIFIER_MAX_LENGTH,
  ID_MAX_LENGTH,
  KEY_MAX_LENGTH,
  TYPE_MAX_LENGTH,
} from '../constants/limit';

export function activityReducers(this: BaseModule) {
  return {
    getActivity: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<ActivityItemChain | undefined> => {
      const { id } = params as { id: Buffer };
      if (!Buffer.isBuffer(id)) {
        throw new Error('id must be a buffer');
      }
      if (id.length > ID_MAX_LENGTH) {
        throw new Error(`maximum id length is ${ID_MAX_LENGTH}`);
      }
      const activity = await getActivity(stateStore, id);
      return activity;
    },
    getActivities: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<ActivityListChain | undefined> => {
      const { identifier, key } = params as Record<string, string>;
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
      const activities = await getActivities(stateStore, identifier, key);
      return activities;
    },
    getActivityGenesis: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<ActivityGenesisChain | undefined> => {
      const { identifier, key } = params as Record<string, string>;
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
      const activitiyGenesis = await getActivityGenesis(stateStore, identifier, key);
      return activitiyGenesis;
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
        if (typeof oldState !== 'object') {
          throw new Error('oldState must be an object');
        }
        if (typeof newState !== 'object') {
          throw new Error('newState must be an object');
        }
        if (typeof payload !== 'object') {
          throw new Error('payload must be an object');
        }
        if (typeof payload.key !== 'string') {
          throw new Error('payload.key must be a string');
        }
        if (payload.key.length > IDENTIFIER_MAX_LENGTH + KEY_MAX_LENGTH + 1) {
          throw new Error(
            `maximum payload.key length is ${IDENTIFIER_MAX_LENGTH + KEY_MAX_LENGTH + 1}`,
          );
        }
        if (typeof payload.type !== 'string') {
          throw new Error('payload.type must be a string');
        }
        if (payload.type.length > TYPE_MAX_LENGTH) {
          throw new Error(`maximum payload.type length is ${TYPE_MAX_LENGTH}`);
        }
        await addActivity(stateStore, oldState, newState, payload);
        return true;
      } catch {
        return false;
      }
    },
  };
}
