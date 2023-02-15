import { BlockRegisrarAsset, RegistrarAsset } from 'enevti-types/chain/registrar';
import { codec, StateStore, testing } from 'lisk-sdk';
import { REGISTRAR_PREFIX } from '../../../../src/app/modules/registrar/constants/codec';
import { REGISTRAR_MODULE_ID } from '../../../../src/app/modules/registrar/constants/id';
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
  const registrarAssetState: RegistrarAsset = {
    id: testBuffer,
  };
  const blockRegistrarAssetState: BlockRegisrarAsset = {
    items: [{ name: 'symbol', payload: 'test' }],
  };
  const registrarStateValue = codec.encode(registrarSchema, registrarAssetState);
  const blockRegistrarStateValue = codec.encode(blockRegistrarSchema, blockRegistrarAssetState);

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
        [`${REGISTRAR_PREFIX}:block:3`]: blockRegistrarStateValue,
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
        if (key === `${REGISTRAR_PREFIX}:block:3`) {
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

      it('should return false for failed operation', async () => {
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
        const expected: BlockRegisrarAsset = { items: [{ name: identifier, payload: value }] };

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
        const expected: BlockRegisrarAsset = {
          items: [{ name: identifier, payload: value }, blockRegistrarAssetState.items[0]],
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
