import {
  ActivityGenesisChain,
  ActivityItemChain,
  ActivityListChain,
} from 'enevti-types/chain/activity';
import { codec, cryptography, StateStore, testing, Transaction } from 'lisk-sdk';
import { diff, jsonPatchPathConverter } from 'just-diff';
import { ActivityModule } from '../../../../src/app/modules/activity/activity_module';
import { ACTIVITY_PREFIX } from '../../../../src/app/modules/activity/constants/codec';
import { activityGenesisSchema } from '../../../../src/app/modules/activity/schema/genesis';
import { activityItemSchema } from '../../../../src/app/modules/activity/schema/item';
import { activityListSchema } from '../../../../src/app/modules/activity/schema/list';
import { diffOptions } from '../../../../src/app/modules/activity/utils/add';
import { ACTIVITY_MODULE_ID } from '../../../../src/app/modules/activity/constants/id';

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
  const transactionId2 = Buffer.from('testTransaction1', 'utf-8');

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
    key: `${identifier}:${key}`,
    type: activityType,
    previousActivityId: activity1Id,
    transaction: transactionId2,
    height: 3,
    diff: variableDiff(state2, state3, diffOptions).text,
    patch: diff(state2, state3, jsonPatchPathConverter).map(p => JSON.stringify(p)),
    payload: Buffer.alloc(0),
  };
  const activity2Id = cryptography.hash(codec.encode(activityItemSchema, activity2));

  const activityList: ActivityListChain = { items: [activity1Id] };
  const activityGenesis: ActivityGenesisChain = { state: JSON.stringify(state1) };

  const activity1Value = codec.encode(activityItemSchema, activity1);
  const activity2Value = codec.encode(activityItemSchema, activity2);

  // eslint-disable-next-line no-console
  console.log(activity2Value, activity2Id);

  const activityListValue = codec.encode(activityListSchema, activityList);
  const activityGenesisValue = codec.encode(activityGenesisSchema, activityGenesis);

  activityModule.init({
    channel,
    logger: testing.mocks.loggerMock,
    dataAccess: new testing.mocks.DataAccessMock(),
  });

  beforeEach(() => {
    stateStore = new testing.mocks.StateStoreMock({
      lastBlockHeaders: [{ height: blockHeight }],
      chain: {
        [`${ACTIVITY_PREFIX}:${activity1Id.toString('hex')}`]: activity1Value,
        [`${ACTIVITY_PREFIX}:${identifier}:${key}`]: activityListValue,
        [`${ACTIVITY_PREFIX}:block:${blockHeight}`]: activityListValue,
        [`${ACTIVITY_PREFIX}:transaction:${transactionId1.toString('hex')}`]: activityListValue,
        [`${ACTIVITY_PREFIX}:${identifier}:${key}:genesis`]: activityGenesisValue,
      },
    });

    jest.spyOn(channel, 'publish');
    jest.spyOn(stateStore.chain, 'get');
    jest.spyOn(stateStore.chain, 'set');

    jest.spyOn(activityModule['_dataAccess'], 'getChainState').mockImplementation(async arg => {
      return new Promise(res => {
        if (arg === `${ACTIVITY_PREFIX}:${activity1Id.toString('hex')}`) {
          res(activity1Value);
        }
        if (arg === `${ACTIVITY_PREFIX}:${identifier}:${key}`) {
          res(activityListValue);
        }
        res(undefined);
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
      expect(channel.publish).toHaveBeenCalledWith(`${ACTIVITY_PREFIX}:blockWithNewActivity`, {
        height: blockHeight,
      });
    });

    it('should publish newActivity event', async () => {
      await activityModule.afterBlockApply(context);
      expect(channel.publish).toHaveBeenCalledWith(`${ACTIVITY_PREFIX}:newActivity`, {
        id: activity1Id,
      });
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
