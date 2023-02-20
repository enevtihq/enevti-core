import { BlockRegisrarChain, RegistrarChain } from 'enevti-types/chain/registrar';
import { codec, StateStore, testing } from 'lisk-sdk';
import {
  BLOCK_REGISTRAR_PREFIX,
  REGISTRAR_PREFIX,
} from '../../../../src/app/modules/registrar/constants/codec';
import { REGISTRAR_MODULE_ID } from '../../../../src/app/modules/registrar/constants/id';
import {
  IDENTIFIER_MAX_LENGTH,
  ID_MAX_LENGTH,
  VALUE_MAX_LENGTH,
} from '../../../../src/app/modules/registrar/constants/limit';
import { RegistrarModule } from '../../../../src/app/modules/registrar/registrar_module';
import { blockRegistrarSchema } from '../../../../src/app/modules/registrar/schema/block';
import { registrarSchema } from '../../../../src/app/modules/registrar/schema/registrar';

describe('RegistrarModule', () => {
  let stateStore: StateStore;
  let context;

  const registrarModule: RegistrarModule = new RegistrarModule(
    testing.fixtures.defaultConfig.genesisConfig,
  );
  const channel = testing.mocks.channelMock;

  const testBuffer = Buffer.from('testSymbol', 'utf8');
  const RegistrarChainState: RegistrarChain = {
    id: testBuffer,
  };
  const blockRegistrarChainState: BlockRegisrarChain = {
    items: [{ name: 'symbol', payload: 'test' }],
  };
  const registrarStateValue = codec.encode(registrarSchema, RegistrarChainState);
  const blockRegistrarStateValue = codec.encode(blockRegistrarSchema, blockRegistrarChainState);

  registrarModule.init({
    channel,
    logger: testing.mocks.loggerMock,
    dataAccess: new testing.mocks.DataAccessMock(),
  });

  beforeEach(() => {
    stateStore = new testing.mocks.StateStoreMock({
      lastBlockHeaders: [{ height: 2 }],
      chain: {
        [`${REGISTRAR_PREFIX}:symbol:test`]: registrarStateValue,
        [`${REGISTRAR_PREFIX}:${BLOCK_REGISTRAR_PREFIX}:3`]: blockRegistrarStateValue,
      },
    });

    jest.spyOn(channel, 'publish');
    jest.spyOn(stateStore.chain, 'get');
    jest.spyOn(stateStore.chain, 'set');

    jest.spyOn(registrarModule['_dataAccess'], 'getChainState').mockImplementation(async key => {
      return new Promise(res => {
        if (key === `${REGISTRAR_PREFIX}:symbol:test`) {
          res(registrarStateValue);
        }
        if (key === `${REGISTRAR_PREFIX}:${BLOCK_REGISTRAR_PREFIX}:3`) {
          res(blockRegistrarStateValue);
        }
        res(undefined);
      });
    });
  });

  describe('constructor', () => {
    it('should have valid id', () => {
      expect(registrarModule.id).toBe(REGISTRAR_MODULE_ID);
    });
    it('should have valid name', () => {
      expect(registrarModule.name).toBe(REGISTRAR_PREFIX);
    });
  });

  describe('afterBlockApply', () => {
    it('should publish newRegistrar event', async () => {
      context = testing.createAfterBlockApplyContext({
        stateStore,
        block: { header: testing.createFakeBlockHeader({ height: 3 }), payload: [] },
      });
      await registrarModule.afterBlockApply(context);
      expect(channel.publish).toHaveBeenCalledWith(`${REGISTRAR_PREFIX}:newRegistrar`, {
        payload: 'symbol:test',
      });
    });
  });

  describe('actions', () => {
    describe('getRegistrar', () => {
      it('should return registrar from blockchain state', async () => {
        const identifier = 'symbol';
        const value = 'test';
        const registrar = await registrarModule.actions.getRegistrar({ identifier, value });
        expect(registrar).toEqual(codec.decode(registrarSchema, registrarStateValue));
      });

      it('should be case-insensitive', async () => {
        const identifier = 'symbol';
        const value = 'Test';
        const registrar = await registrarModule.actions.getRegistrar({ identifier, value });
        expect(registrar).toEqual(codec.decode(registrarSchema, registrarStateValue));
      });

      it('should return undefined if data is not exist in blockchain', async () => {
        const identifier = 'unknown';
        const value = 'unknown';
        const registrar = await registrarModule.actions.getRegistrar({ identifier, value });
        expect(registrar).toBeUndefined();
      });

      it('should throw an error if identifier is not string', async () => {
        const registrar = async () => {
          try {
            await registrarModule.actions.getRegistrar({ identifier: 3, value: 'value' });
            return true;
          } catch {
            return false;
          }
        };
        expect(await registrar()).toBe(false);
      });

      it('should throw an error if value is not string', async () => {
        const registrar = async () => {
          try {
            await registrarModule.actions.getRegistrar({ identifier: 'identifier', value: 3 });
            return true;
          } catch {
            return false;
          }
        };
        expect(await registrar()).toBe(false);
      });

      it('should throw an error if identifier length is exceeding limit', async () => {
        const registrar = async () => {
          try {
            const exceeding = 'a'.repeat(IDENTIFIER_MAX_LENGTH + 1);
            await registrarModule.actions.getRegistrar({ identifier: exceeding, value: 'test' });
            return true;
          } catch {
            return false;
          }
        };
        expect(await registrar()).toBe(false);
      });

      it('should throw an error if value length is exceeding limit', async () => {
        const registrar = async () => {
          try {
            const exceeding = 'a'.repeat(VALUE_MAX_LENGTH + 1);
            await registrarModule.actions.getRegistrar({ identifier: 'test', value: exceeding });
            return true;
          } catch {
            return false;
          }
        };
        expect(await registrar()).toBe(false);
      });
    });

    describe('getBlockRegistrar', () => {
      it('should return block registrar from blockchain state', async () => {
        const height = 3;
        const blockRegistrar = await registrarModule.actions.getBlockRegistrar({ height });
        expect(blockRegistrar).toEqual(
          codec.decode(blockRegistrarSchema, blockRegistrarStateValue),
        );
      });

      it('should return undefined if data is not exist in blockchain', async () => {
        const height = -1;
        const blockRegistrar = await registrarModule.actions.getBlockRegistrar({ height });
        expect(blockRegistrar).toBeUndefined();
      });

      it('should throw an error if height is not number', async () => {
        const blockRegistrar = async () => {
          try {
            await registrarModule.actions.getBlockRegistrar({ height: 'height' });
            return true;
          } catch {
            return false;
          }
        };
        expect(await blockRegistrar()).toBe(false);
      });
    });
  });

  describe('reducers', () => {
    describe('getRegistrar', () => {
      it('should return registrar from blockchain state', async () => {
        const identifier = 'symbol';
        const value = 'test';
        const registrar = await registrarModule.reducers.getRegistrar(
          { identifier, value },
          stateStore,
        );
        expect(registrar).toEqual(codec.decode(registrarSchema, registrarStateValue));
      });

      it('should be case-insensitive', async () => {
        const identifier = 'symbol';
        const value = 'Test';
        const registrar = await registrarModule.reducers.getRegistrar(
          { identifier, value },
          stateStore,
        );
        expect(registrar).toEqual(codec.decode(registrarSchema, registrarStateValue));
      });

      it('should return undefined if data is not exist in blockchain', async () => {
        const identifier = 'unknown';
        const value = 'unknown';
        const registrar = await registrarModule.reducers.getRegistrar(
          { identifier, value },
          stateStore,
        );
        expect(registrar).toBeUndefined();
      });

      it('should throw an error if identifier is not string', async () => {
        const registrar = async () => {
          try {
            await registrarModule.reducers.getRegistrar(
              { identifier: 3, value: 'value' },
              stateStore,
            );
            return true;
          } catch {
            return false;
          }
        };
        expect(await registrar()).toBe(false);
      });

      it('should throw an error if value is not string', async () => {
        const registrar = async () => {
          try {
            await registrarModule.reducers.getRegistrar(
              { identifier: 'identifier', value: 3 },
              stateStore,
            );
            return true;
          } catch {
            return false;
          }
        };
        expect(await registrar()).toBe(false);
      });

      it('should throw an error if identifier length is exceeding limit', async () => {
        const registrar = async () => {
          try {
            const exceeding = 'a'.repeat(IDENTIFIER_MAX_LENGTH + 1);
            await registrarModule.reducers.getRegistrar(
              { identifier: exceeding, value: 'test' },
              stateStore,
            );
            return true;
          } catch {
            return false;
          }
        };
        expect(await registrar()).toBe(false);
      });

      it('should throw an error if value length is exceeding limit', async () => {
        const registrar = async () => {
          try {
            const exceeding = 'a'.repeat(VALUE_MAX_LENGTH + 1);
            await registrarModule.reducers.getRegistrar(
              { identifier: 'test', value: exceeding },
              stateStore,
            );
            return true;
          } catch {
            return false;
          }
        };
        expect(await registrar()).toBe(false);
      });
    });

    describe('getBlockRegistrar', () => {
      it('should return block registrar from blockchain state', async () => {
        const height = 3;
        const blockRegistrar = await registrarModule.reducers.getBlockRegistrar(
          { height },
          stateStore,
        );
        expect(blockRegistrar).toEqual(
          codec.decode(blockRegistrarSchema, blockRegistrarStateValue),
        );
      });

      it('should return undefined if data is not exist in blockchain', async () => {
        const height = -1;
        const blockRegistrar = await registrarModule.reducers.getBlockRegistrar(
          { height },
          stateStore,
        );
        expect(blockRegistrar).toBeUndefined();
      });

      it('should throw an error if height is not number', async () => {
        const blockRegistrar = async () => {
          try {
            await registrarModule.reducers.getBlockRegistrar({ height: 'height' }, stateStore);
            return true;
          } catch {
            return false;
          }
        };
        expect(await blockRegistrar()).toBe(false);
      });
    });

    describe('setRegistrar', () => {
      it('should return true for successful operation', async () => {
        const identifier = 'collection';
        const value = 'value';
        const id = testBuffer;

        const res = await registrarModule.reducers.setRegistrar(
          { identifier, value, id },
          stateStore,
        );

        expect(res).toBe(true);
      });

      it('should return false if identifier length is exceeding limit', async () => {
        const identifier = 'a'.repeat(VALUE_MAX_LENGTH + 1);
        const value = 'test';
        const id = Buffer.alloc(0);

        const res = await registrarModule.reducers.setRegistrar(
          { identifier, value, id },
          stateStore,
        );

        expect(res).toBe(false);
      });

      it('should return false if value length is exceeding limit', async () => {
        const identifier = 'test';
        const value = 'a'.repeat(VALUE_MAX_LENGTH + 1);
        const id = Buffer.alloc(0);

        const res = await registrarModule.reducers.setRegistrar(
          { identifier, value, id },
          stateStore,
        );

        expect(res).toBe(false);
      });

      it('should return false if id length is exceeding limit', async () => {
        const identifier = 'test';
        const value = 'test';
        const id = Buffer.alloc(ID_MAX_LENGTH + 1);

        const res = await registrarModule.reducers.setRegistrar(
          { identifier, value, id },
          stateStore,
        );

        expect(res).toBe(false);
      });

      it('should return false if identifier is not a string', async () => {
        const identifier = 3;
        const value = 'value';
        const id = Buffer.alloc(0);

        const res = await registrarModule.reducers.setRegistrar(
          { identifier, value, id },
          stateStore,
        );

        expect(res).toBe(false);
      });

      it('should return false if value is not a string', async () => {
        const identifier = 'collection';
        const value = 3;
        const id = Buffer.alloc(0);

        const res = await registrarModule.reducers.setRegistrar(
          { identifier, value, id },
          stateStore,
        );

        expect(res).toBe(false);
      });

      it('should return false if id is not a buffer', async () => {
        const identifier = 'collection';
        const value = 'value';
        const id = 'invalidBuffer';

        const res = await registrarModule.reducers.setRegistrar(
          { identifier, value, id },
          stateStore,
        );

        expect(res).toBe(false);
      });

      it('should update registrar with value provided', async () => {
        const identifier = 'collection';
        const value = 'value';
        const id = testBuffer;

        await registrarModule.reducers.setRegistrar({ identifier, value, id }, stateStore);
        const chainState = await registrarModule.reducers.getRegistrar(
          { identifier, value },
          stateStore,
        );

        expect(chainState).toEqual({ id });
      });

      it('should update block registrar with value provided', async () => {
        const lastBlockHeight = 1;
        stateStore = new testing.mocks.StateStoreMock({
          lastBlockHeaders: [{ height: lastBlockHeight }],
        });

        const identifier = 'collection';
        const value = 'value';
        const id = testBuffer;
        const expected: BlockRegisrarChain = { items: [{ name: identifier, payload: value }] };

        await registrarModule.reducers.setRegistrar({ identifier, value, id }, stateStore);
        const chainState = await registrarModule.reducers.getBlockRegistrar(
          { height: lastBlockHeight + 1 },
          stateStore,
        );

        expect(chainState).toEqual(expected);
      });

      it('should unshift block registrar with value provided', async () => {
        const identifier = 'collection';
        const value = 'value';
        const lastBlockHeight = 2;
        const id = testBuffer;
        const expected: BlockRegisrarChain = {
          items: [{ name: identifier, payload: value }, blockRegistrarChainState.items[0]],
        };

        await registrarModule.reducers.setRegistrar({ identifier, value, id }, stateStore);
        const chainState = await registrarModule.reducers.getBlockRegistrar(
          { height: lastBlockHeight + 1 },
          stateStore,
        );

        expect(chainState).toEqual(expected);
      });
    });
  });

  describe('beforeBlockApply', () => {
    it('should do nothing and not throw error', () => {
      const dummy = {};
      const func = async () => registrarModule.beforeBlockApply(dummy as any);
      expect(func).not.toThrow();
    });
  });

  describe('beforeTransactionApply', () => {
    it('should do nothing and not throw error', () => {
      const dummy = {};
      const func = async () => registrarModule.beforeTransactionApply(dummy as any);
      expect(func).not.toThrow();
    });
  });

  describe('afterTransactionApply', () => {
    it('should do nothing and not throw error', () => {
      const dummy = {};
      const func = async () => registrarModule.afterTransactionApply(dummy as any);
      expect(func).not.toThrow();
    });
  });

  describe('afterGenesisBlockApply', () => {
    it('should do nothing and not throw error', () => {
      const dummy = {};
      const func = async () => registrarModule.afterGenesisBlockApply(dummy as any);
      expect(func).not.toThrow();
    });
  });
});
