import {
  ActivityGenesisChain,
  ActivityItemChain,
  ActivityListChain,
} from 'enevti-types/chain/activity';
import {
  AddActivityPayload,
  BlockWithNewActivityEvent,
  NewActivityEvent,
} from 'enevti-types/param/activity';
import { codec, cryptography, StateStore, testing, Transaction } from 'lisk-sdk';
import { diff, jsonPatchPathConverter } from 'just-diff';
import { ACTIVITY_MODULE_ID } from 'enevti-types/constant/id';
import { ID_BYTES_MAX_LENGTH, KEY_STRING_MAX_LENGTH } from 'enevti-types/constant/validation';
import { ActivityModule } from '../../../../src/app/modules/activity/activity_module';
import {
  ACTIVITY_PREFIX,
  GENESIS_ACTIVITY_PREFIX,
} from '../../../../src/app/modules/activity/constants/codec';
import { activityGenesisSchema } from '../../../../src/app/modules/activity/schema/genesis';
import { activityItemSchema } from '../../../../src/app/modules/activity/schema/item';
import { activityListSchema } from '../../../../src/app/modules/activity/schema/list';
import { diffOptions } from '../../../../src/app/modules/activity/utils/add';

// eslint-disable-next-line import/order
import variableDiff = require('variable-diff');

describe('ActivityModule', () => {
  let stateStore: StateStore;
  let context;

  const activityModule: ActivityModule = new ActivityModule(
    testing.fixtures.defaultConfig.genesisConfig,
  );
  const channel = testing.mocks.channelMock;

  const blockHeight = 2;
  const identifier = 'state';
  const key = 'test';
  const activityType = 'type';
  const state1 = { state: '1' };
  const state2 = { state: '2' };
  const state3 = { state: '3' };
  const transactionId1 = Buffer.from('testTransaction1', 'utf-8');
  const transactionId2 = Buffer.from('testTransaction2', 'utf-8');
  const payload = Buffer.from('testPayload', 'utf-8');
  const addActivityPayload: AddActivityPayload = {
    key: `${identifier}:${key}`,
    type: activityType,
    transaction: transactionId2,
    payload,
  };

  const activity1: ActivityItemChain = {
    key: `${identifier}:${key}`,
    type: activityType,
    previousActivityId: Buffer.alloc(0),
    transaction: transactionId1,
    height: 2,
    diff: variableDiff(state1, state2, diffOptions).text,
    patch: diff(state1, state2, jsonPatchPathConverter).map(p => JSON.stringify(p)),
    payload: Buffer.alloc(0),
  };
  const activity1Id = cryptography.hash(codec.encode(activityItemSchema, activity1));

  const activity2: ActivityItemChain = {
    ...(addActivityPayload as any),
    previousActivityId: activity1Id,
    height: 3,
    diff: variableDiff(state2, state3, diffOptions).text,
    patch: diff(state2, state3, jsonPatchPathConverter).map(p => JSON.stringify(p)),
  };
  const activity2Id = cryptography.hash(codec.encode(activityItemSchema, activity2));

  const noTransactionActivity: ActivityItemChain = {
    ...(addActivityPayload as any),
    transaction: Buffer.alloc(0),
    previousActivityId: activity1Id,
    height: 3,
    diff: variableDiff(state2, state3, diffOptions).text,
    patch: diff(state2, state3, jsonPatchPathConverter).map(p => JSON.stringify(p)),
  };
  const noTransactionActivityId = cryptography.hash(
    codec.encode(activityItemSchema, noTransactionActivity),
  );

  const noPayloadActivity: ActivityItemChain = {
    ...(addActivityPayload as any),
    payload: Buffer.alloc(0),
    previousActivityId: activity1Id,
    height: 3,
    diff: variableDiff(state2, state3, diffOptions).text,
    patch: diff(state2, state3, jsonPatchPathConverter).map(p => JSON.stringify(p)),
  };
  const noPayloadActivityId = cryptography.hash(
    codec.encode(activityItemSchema, noPayloadActivity),
  );

  const activityList: ActivityListChain = { items: [activity1Id] };
  const activityGenesis: ActivityGenesisChain = { state: JSON.stringify(state1) };

  const activity1Value = codec.encode(activityItemSchema, activity1);
  const activityListValue = codec.encode(activityListSchema, activityList);
  const activityGenesisValue = codec.encode(activityGenesisSchema, activityGenesis);

  activityModule.init({
    channel,
    logger: testing.mocks.loggerMock,
    dataAccess: new testing.mocks.DataAccessMock(),
  });

  beforeEach(() => {
    const chain = {
      [`${ACTIVITY_PREFIX}:${activity1Id.toString('hex')}`]: activity1Value,
      [`${ACTIVITY_PREFIX}:${identifier}:${key}`]: activityListValue,
      [`${ACTIVITY_PREFIX}:block:${blockHeight}`]: activityListValue,
      [`${ACTIVITY_PREFIX}:transaction:${transactionId1.toString('hex')}`]: activityListValue,
      [`${ACTIVITY_PREFIX}:${identifier}:${key}:${GENESIS_ACTIVITY_PREFIX}`]: activityGenesisValue,
    };

    stateStore = new testing.mocks.StateStoreMock({
      lastBlockHeaders: [{ height: blockHeight }],
      chain,
    });

    jest.spyOn(channel, 'publish');
    jest.spyOn(stateStore.chain, 'get');
    jest.spyOn(stateStore.chain, 'set');

    jest.spyOn(activityModule['_dataAccess'], 'getChainState').mockImplementation(async arg => {
      return new Promise(res => {
        res(chain[arg]);
      });
    });
  });

  describe('constructor', () => {
    it('should have valid id', () => {
      expect(activityModule.id).toBe(ACTIVITY_MODULE_ID);
    });
    it('should have valid name', () => {
      expect(activityModule.name).toBe(ACTIVITY_PREFIX);
    });
  });

  describe('afterBlockApply', () => {
    beforeEach(() => {
      context = testing.createAfterBlockApplyContext({
        stateStore,
        block: {
          header: testing.createFakeBlockHeader({ height: blockHeight }),
          payload: [({ id: transactionId1 } as unknown) as Transaction],
        },
      });
    });

    it('should publish blockWithNewActivity event', async () => {
      await activityModule.afterBlockApply(context);
      const eventPayload: BlockWithNewActivityEvent = { height: blockHeight };
      expect(channel.publish).toHaveBeenCalledWith(
        `${ACTIVITY_PREFIX}:blockWithNewActivity`,
        eventPayload,
      );
    });

    it('should publish newActivity event', async () => {
      await activityModule.afterBlockApply(context);
      const eventPayload: NewActivityEvent = { id: activity1Id };
      expect(channel.publish).toHaveBeenCalledWith(`${ACTIVITY_PREFIX}:newActivity`, eventPayload);
    });
  });

  describe('actions', () => {
    describe('getActivity', () => {
      it('should return activity data from blockchain state', async () => {
        const activity = await activityModule.actions.getActivity({ id: activity1Id });
        expect(activity).toEqual(activity1);
      });

      it('should return undefined if data is not exist in blockchain', async () => {
        const undefinedId = Buffer.from('undefined', 'utf-8');
        const activity = await activityModule.actions.getActivity({ id: undefinedId });
        expect(activity).toBeUndefined();
      });

      it('should throw an error if id is not buffer', async () => {
        const activity = async () => {
          try {
            await activityModule.actions.getActivity({ id: {} });
            return true;
          } catch {
            return false;
          }
        };
        expect(await activity()).toBe(false);
      });

      it('should throw an error if id length is exceeding limit', async () => {
        const activity = async () => {
          try {
            const id = Buffer.alloc(ID_BYTES_MAX_LENGTH + 1);
            await activityModule.actions.getActivity({ id });
            return true;
          } catch {
            return false;
          }
        };
        expect(await activity()).toBe(false);
      });
    });

    describe('getActivities', () => {
      it('should return activities data from blockchain state', async () => {
        const activities = await activityModule.actions.getActivities({ identifier, key });
        expect(activities).toEqual(activityList);
      });

      it('should return undefined if data is not exist in blockchain', async () => {
        const activities = await activityModule.actions.getActivities({
          identifier: 'undefined',
          key: 'undefined',
        });
        expect(activities).toBeUndefined();
      });

      it('should throw an error if identifier is not string', async () => {
        const activities = async () => {
          try {
            await activityModule.actions.getActivities({ identifier: 3, key });
            return true;
          } catch {
            return false;
          }
        };
        expect(await activities()).toBe(false);
      });

      it('should throw an error if key is not string', async () => {
        const activities = async () => {
          try {
            await activityModule.actions.getActivities({ identifier, key: 3 });
            return true;
          } catch {
            return false;
          }
        };
        expect(await activities()).toBe(false);
      });

      it('should throw an error if identifier length is exceeding limit', async () => {
        const activity = async () => {
          try {
            const exceeded = 'a'.repeat(KEY_STRING_MAX_LENGTH + 1);
            await activityModule.actions.getActivities({ identifier: exceeded, key });
            return true;
          } catch {
            return false;
          }
        };
        expect(await activity()).toBe(false);
      });

      it('should throw an error if key length is exceeding limit', async () => {
        const activity = async () => {
          try {
            const exceeded = 'a'.repeat(KEY_STRING_MAX_LENGTH + 1);
            await activityModule.actions.getActivities({ identifier, key: exceeded });
            return true;
          } catch {
            return false;
          }
        };
        expect(await activity()).toBe(false);
      });
    });

    describe('getActivityGenesis', () => {
      it('should return genesis activity data from blockchain state', async () => {
        const activity = await activityModule.actions.getActivityGenesis({ identifier, key });
        expect(activity).toEqual(activityGenesis);
      });

      it('should return undefined if data is not exist in blockchain', async () => {
        const activity = await activityModule.actions.getActivityGenesis({
          identifier: 'undefined',
          key: 'undefined',
        });
        expect(activity).toBeUndefined();
      });

      it('should throw an error if identifier is not string', async () => {
        const activities = async () => {
          try {
            await activityModule.actions.getActivityGenesis({ identifier: 3, key });
            return true;
          } catch {
            return false;
          }
        };
        expect(await activities()).toBe(false);
      });

      it('should throw an error if key is not string', async () => {
        const activities = async () => {
          try {
            await activityModule.actions.getActivityGenesis({ identifier, key: 3 });
            return true;
          } catch {
            return false;
          }
        };
        expect(await activities()).toBe(false);
      });

      it('should throw an error if identifier length is exceeding limit', async () => {
        const activity = async () => {
          try {
            const exceeded = 'a'.repeat(KEY_STRING_MAX_LENGTH + 1);
            await activityModule.actions.getActivityGenesis({ identifier: exceeded, key });
            return true;
          } catch {
            return false;
          }
        };
        expect(await activity()).toBe(false);
      });

      it('should throw an error if key length is exceeding limit', async () => {
        const activity = async () => {
          try {
            const exceeded = 'a'.repeat(KEY_STRING_MAX_LENGTH + 1);
            await activityModule.actions.getActivityGenesis({ identifier, key: exceeded });
            return true;
          } catch {
            return false;
          }
        };
        expect(await activity()).toBe(false);
      });
    });
  });

  describe('reducers', () => {
    describe('getActivity', () => {
      it('should return activity data from blockchain state', async () => {
        const activity = await activityModule.reducers.getActivity({ id: activity1Id }, stateStore);
        expect(activity).toEqual(activity1);
      });

      it('should return undefined if data is not exist in blockchain', async () => {
        const undefinedId = Buffer.from('undefined', 'utf-8');
        const activity = await activityModule.reducers.getActivity({ id: undefinedId }, stateStore);
        expect(activity).toBeUndefined();
      });

      it('should throw an error if id is not buffer', async () => {
        const activity = async () => {
          try {
            await activityModule.reducers.getActivity({ id: {} }, stateStore);
            return true;
          } catch {
            return false;
          }
        };
        expect(await activity()).toBe(false);
      });

      it('should throw an error if id length is exceeding limit', async () => {
        const activity = async () => {
          try {
            const id = Buffer.alloc(ID_BYTES_MAX_LENGTH + 1);
            await activityModule.reducers.getActivity({ id }, stateStore);
            return true;
          } catch {
            return false;
          }
        };
        expect(await activity()).toBe(false);
      });
    });

    describe('getActivities', () => {
      it('should return activities data from blockchain state', async () => {
        const activities = await activityModule.reducers.getActivities(
          { identifier, key },
          stateStore,
        );
        expect(activities).toEqual(activityList);
      });

      it('should return undefined if data is not exist in blockchain', async () => {
        const activities = await activityModule.reducers.getActivities(
          {
            identifier: 'undefined',
            key: 'undefined',
          },
          stateStore,
        );
        expect(activities).toBeUndefined();
      });

      it('should throw an error if identifier is not string', async () => {
        const activities = async () => {
          try {
            await activityModule.reducers.getActivities({ identifier: 3, key }, stateStore);
            return true;
          } catch {
            return false;
          }
        };
        expect(await activities()).toBe(false);
      });

      it('should throw an error if key is not string', async () => {
        const activities = async () => {
          try {
            await activityModule.reducers.getActivities({ identifier, key: 3 }, stateStore);
            return true;
          } catch {
            return false;
          }
        };
        expect(await activities()).toBe(false);
      });

      it('should throw an error if identifier length is exceeding limit', async () => {
        const activity = async () => {
          try {
            const exceeded = 'a'.repeat(KEY_STRING_MAX_LENGTH + 1);
            await activityModule.reducers.getActivities({ identifier: exceeded, key }, stateStore);
            return true;
          } catch {
            return false;
          }
        };
        expect(await activity()).toBe(false);
      });

      it('should throw an error if key length is exceeding limit', async () => {
        const activity = async () => {
          try {
            const exceeded = 'a'.repeat(KEY_STRING_MAX_LENGTH + 1);
            await activityModule.reducers.getActivities({ identifier, key: exceeded }, stateStore);
            return true;
          } catch {
            return false;
          }
        };
        expect(await activity()).toBe(false);
      });
    });

    describe('getActivityGenesis', () => {
      it('should return genesis activity data from blockchain state', async () => {
        const activities = await activityModule.reducers.getActivityGenesis(
          { identifier, key },
          stateStore,
        );
        expect(activities).toEqual(activityGenesis);
      });

      it('should return undefined if data is not exist in blockchain', async () => {
        const activities = await activityModule.reducers.getActivityGenesis(
          {
            identifier: 'undefined',
            key: 'undefined',
          },
          stateStore,
        );
        expect(activities).toBeUndefined();
      });

      it('should throw an error if identifier is not string', async () => {
        const activities = async () => {
          try {
            await activityModule.reducers.getActivityGenesis({ identifier: 3, key }, stateStore);
            return true;
          } catch {
            return false;
          }
        };
        expect(await activities()).toBe(false);
      });

      it('should throw an error if key is not string', async () => {
        const activities = async () => {
          try {
            await activityModule.reducers.getActivityGenesis({ identifier, key: 3 }, stateStore);
            return true;
          } catch {
            return false;
          }
        };
        expect(await activities()).toBe(false);
      });

      it('should throw an error if identifier length is exceeding limit', async () => {
        const activity = async () => {
          try {
            const exceeded = 'a'.repeat(KEY_STRING_MAX_LENGTH + 1);
            await activityModule.reducers.getActivityGenesis(
              { identifier: exceeded, key },
              stateStore,
            );
            return true;
          } catch {
            return false;
          }
        };
        expect(await activity()).toBe(false);
      });

      it('should throw an error if key length is exceeding limit', async () => {
        const activity = async () => {
          try {
            const exceeded = 'a'.repeat(KEY_STRING_MAX_LENGTH + 1);
            await activityModule.reducers.getActivityGenesis(
              { identifier, key: exceeded },
              stateStore,
            );
            return true;
          } catch {
            return false;
          }
        };
        expect(await activity()).toBe(false);
      });
    });

    describe('addActivity', () => {
      it('should return false if payload.key length is exceeding limit', async () => {
        const activities = await activityModule.reducers.addActivity(
          {
            oldState: state2,
            newState: state3,
            payload: {
              ...addActivityPayload,
              key: 'a'.repeat(KEY_STRING_MAX_LENGTH + KEY_STRING_MAX_LENGTH + 1 + 1),
            },
          },
          stateStore,
        );
        expect(activities).toBe(false);
      });

      it('should return false if payload.type length is exceeding limit', async () => {
        const activities = await activityModule.reducers.addActivity(
          {
            oldState: state2,
            newState: state3,
            payload: {
              ...addActivityPayload,
              type: 'a'.repeat(KEY_STRING_MAX_LENGTH + 1),
            },
          },
          stateStore,
        );
        expect(activities).toBe(false);
      });

      it('should return false if oldState is not an object', async () => {
        const activities = await activityModule.reducers.addActivity(
          { oldState: 3, newState: state3, payload: addActivityPayload },
          stateStore,
        );
        expect(activities).toBe(false);
      });

      it('should return false if newState is not an object', async () => {
        const activities = await activityModule.reducers.addActivity(
          { oldState: state2, newState: 3, payload: addActivityPayload },
          stateStore,
        );
        expect(activities).toBe(false);
      });

      it('should return false if payload is not an object', async () => {
        const activities = await activityModule.reducers.addActivity(
          { oldState: state2, newState: state3, payload: 'invalid' },
          stateStore,
        );
        expect(activities).toBe(false);
      });

      it('should return false if payload.key is not an string', async () => {
        const activities = await activityModule.reducers.addActivity(
          { oldState: state2, newState: state3, payload: { ...addActivityPayload, key: 3 } },
          stateStore,
        );
        expect(activities).toBe(false);
      });

      it('should return false if payload.type is not an string', async () => {
        const activities = await activityModule.reducers.addActivity(
          { oldState: state2, newState: state3, payload: { ...addActivityPayload, type: 3 } },
          stateStore,
        );
        expect(activities).toBe(false);
      });

      it('should return true for succesful operation', async () => {
        const res = await activityModule.reducers.addActivity(
          { oldState: state2, newState: state3, payload: addActivityPayload },
          stateStore,
        );

        expect(res).toBe(true);
      });

      it('should return false for failed operation', async () => {
        const res = await activityModule.reducers.addActivity(
          { oldState: 'invalidState', newState: 'invalidState', payload: 'invalidPayload' },
          stateStore,
        );

        expect(res).toBe(false);
      });

      it('should add new activity and set it to the blockchain', async () => {
        await activityModule.reducers.addActivity(
          { oldState: state2, newState: state3, payload: addActivityPayload },
          stateStore,
        );
        const activity = await activityModule.reducers.getActivity({ id: activity2Id }, stateStore);

        expect(activity).toEqual(activity2);
      });

      it('should add new activity to the activities list according to key', async () => {
        await activityModule.reducers.addActivity(
          { oldState: state2, newState: state3, payload: addActivityPayload },
          stateStore,
        );
        const activities = await activityModule.reducers.getActivities(
          { identifier, key },
          stateStore,
        );

        expect(activities).toEqual({ items: [activity2Id, ...activityList['items']] });
      });

      it('should add new activity to the transaction activities', async () => {
        await activityModule.reducers.addActivity(
          { oldState: state2, newState: state3, payload: addActivityPayload },
          stateStore,
        );
        const activities = await activityModule.reducers.getActivities(
          { identifier: 'transaction', key: transactionId2.toString('hex') },
          stateStore,
        );

        expect(activities).toEqual({ items: [activity2Id] });
      });

      it('should unshift a new activity to the transaction activities if exist', async () => {
        const activityChain: ActivityItemChain = {
          ...(addActivityPayload as any),
          transaction: transactionId1,
          previousActivityId: activity1Id,
          height: 3,
          diff: variableDiff(state2, state3, diffOptions).text,
          patch: diff(state2, state3, jsonPatchPathConverter).map(p => JSON.stringify(p)),
        };
        const activityChainId = cryptography.hash(codec.encode(activityItemSchema, activityChain));

        await activityModule.reducers.addActivity(
          {
            oldState: state2,
            newState: state3,
            payload: { ...addActivityPayload, transaction: transactionId1 },
          },
          stateStore,
        );
        const activities = await activityModule.reducers.getActivities(
          { identifier: 'transaction', key: transactionId1.toString('hex') },
          stateStore,
        );

        expect(activities).toEqual({ items: [activityChainId, activity1Id] });
      });

      it('should add new activity to the block activities', async () => {
        await activityModule.reducers.addActivity(
          { oldState: state2, newState: state3, payload: addActivityPayload },
          stateStore,
        );
        const activities = await activityModule.reducers.getActivities(
          { identifier: 'block', key: (blockHeight + 1).toString() },
          stateStore,
        );

        expect(activities).toEqual({ items: [activity2Id] });
      });

      it('should unshift a new activity to the block activities if exist', async () => {
        stateStore = new testing.mocks.StateStoreMock({
          lastBlockHeaders: [{ height: blockHeight - 1 }],
          chain: {
            [`${ACTIVITY_PREFIX}:${activity1Id.toString('hex')}`]: activity1Value,
            [`${ACTIVITY_PREFIX}:${identifier}:${key}`]: activityListValue,
            [`${ACTIVITY_PREFIX}:block:${blockHeight}`]: activityListValue,
            [`${ACTIVITY_PREFIX}:transaction:${transactionId1.toString('hex')}`]: activityListValue,
            [`${ACTIVITY_PREFIX}:${identifier}:${key}:genesis`]: activityGenesisValue,
          },
        });

        const activityChain: ActivityItemChain = {
          ...(addActivityPayload as any),
          previousActivityId: activity1Id,
          height: blockHeight,
          diff: variableDiff(state2, state3, diffOptions).text,
          patch: diff(state2, state3, jsonPatchPathConverter).map(p => JSON.stringify(p)),
        };
        const activityChainId = cryptography.hash(codec.encode(activityItemSchema, activityChain));

        await activityModule.reducers.addActivity(
          {
            oldState: state2,
            newState: state3,
            payload: { ...addActivityPayload },
          },
          stateStore,
        );
        const activities = await activityModule.reducers.getActivities(
          { identifier: 'block', key: blockHeight.toString() },
          stateStore,
        );

        expect(activities).toEqual({ items: [activityChainId, activity1Id] });
      });

      it('should add new activity to the genesis activity if key is not exist before', async () => {
        await activityModule.reducers.addActivity(
          {
            oldState: state2,
            newState: state3,
            payload: { ...addActivityPayload, key: 'new:key' },
          },
          stateStore,
        );
        const genesisActivity = await activityModule.reducers.getActivityGenesis(
          { identifier: 'new', key: 'key' },
          stateStore,
        );

        expect(genesisActivity).toBeDefined();
      });

      it('should include a valid state diff to new activity', async () => {
        await activityModule.reducers.addActivity(
          {
            oldState: state2,
            newState: state3,
            payload: addActivityPayload,
          },
          stateStore,
        );
        const activity = await activityModule.reducers.getActivity({ id: activity2Id }, stateStore);

        expect(activity.diff).toEqual(activity2.diff);
      });

      it('should include a valid state patch to new activity', async () => {
        await activityModule.reducers.addActivity(
          {
            oldState: state2,
            newState: state3,
            payload: addActivityPayload,
          },
          stateStore,
        );
        const activity = await activityModule.reducers.getActivity({ id: activity2Id }, stateStore);

        expect(activity.patch).toEqual(activity2.patch);
      });

      it('should include previousActivityId if exist', async () => {
        await activityModule.reducers.addActivity(
          { oldState: state2, newState: state3, payload: addActivityPayload },
          stateStore,
        );
        const activity = await activityModule.reducers.getActivity({ id: activity2Id }, stateStore);

        expect(activity.previousActivityId).toEqual(activity1Id);
      });

      it('should include an empty buffer if transaction is not provided to payload', async () => {
        await activityModule.reducers.addActivity(
          {
            oldState: state2,
            newState: state3,
            payload: { ...addActivityPayload, transaction: undefined },
          },
          stateStore,
        );
        const activity = await activityModule.reducers.getActivity(
          { id: noTransactionActivityId },
          stateStore,
        );

        expect(activity.transaction).toEqual(noTransactionActivity.transaction);
      });

      it('should include an empty buffer if payload is not provided to activity', async () => {
        await activityModule.reducers.addActivity(
          {
            oldState: state2,
            newState: state3,
            payload: { ...addActivityPayload, payload: undefined },
          },
          stateStore,
        );
        const activity = await activityModule.reducers.getActivity(
          { id: noPayloadActivityId },
          stateStore,
        );

        expect(activity.transaction).toEqual(noPayloadActivity.transaction);
      });
    });
  });

  describe('beforeBlockApply', () => {
    it('should do nothing and not throw error', () => {
      const dummy = {};
      const func = async () => activityModule.beforeBlockApply(dummy as any);
      expect(func).not.toThrow();
    });
  });

  describe('beforeTransactionApply', () => {
    it('should do nothing and not throw error', () => {
      const dummy = {};
      const func = async () => activityModule.beforeTransactionApply(dummy as any);
      expect(func).not.toThrow();
    });
  });

  describe('afterTransactionApply', () => {
    it('should do nothing and not throw error', () => {
      const dummy = {};
      const func = async () => activityModule.afterTransactionApply(dummy as any);
      expect(func).not.toThrow();
    });
  });

  describe('afterGenesisBlockApply', () => {
    it('should do nothing and not throw error', () => {
      const dummy = {};
      const func = async () => activityModule.afterGenesisBlockApply(dummy as any);
      expect(func).not.toThrow();
    });
  });
});
