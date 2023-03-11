import { CountChain, CountItemChain } from 'enevti-types/chain/count';
import { codec, StateStore, testing } from 'lisk-sdk';
import { COUNT_MODULE_ID } from 'enevti-types/constant/id';
import { ADDRESS_BYTES_MAX_LENGTH, KEY_STRING_MAX_LENGTH } from 'enevti-types/constant/validation';
import { COUNT_ITEM_PREFIX, COUNT_PREFIX } from '../../../../src/app/modules/count/constants/codec';
import { CountModule } from '../../../../src/app/modules/count/count_module';
import { countSchema } from '../../../../src/app/modules/count/schema/count';
import { countItemSchema } from '../../../../src/app/modules/count/schema/item';

describe('CountModule', () => {
  let stateStore: StateStore;

  const countModule: CountModule = new CountModule(testing.fixtures.defaultConfig.genesisConfig);
  const channel = testing.mocks.channelMock;

  const module = 'module';
  const key = 'key';
  const { address } = testing.fixtures.createDefaultAccount();
  const item = Buffer.from('newData', 'utf-8');
  const countChain: CountChain = {
    total: 1,
  };
  const countItemChain: CountItemChain = {
    items: [Buffer.from('test', 'utf-8')],
  };
  const countValue = codec.encode(countSchema, countChain);
  const countItemValue = codec.encode(countItemSchema, countItemChain);

  countModule.init({
    channel,
    logger: testing.mocks.loggerMock,
    dataAccess: new testing.mocks.DataAccessMock(),
  });

  beforeEach(() => {
    const chain = {
      [`${COUNT_PREFIX}:${module}:${address.toString('hex')}`]: countValue,
      [`${COUNT_PREFIX}:${module}:${key}:${address.toString(
        'hex',
      )}:${COUNT_ITEM_PREFIX}`]: countItemValue,
    };

    stateStore = new testing.mocks.StateStoreMock({
      chain,
    });

    jest.spyOn(stateStore.chain, 'get');
    jest.spyOn(stateStore.chain, 'set');

    jest.spyOn(countModule['_dataAccess'], 'getChainState').mockImplementation(async arg => {
      return new Promise(res => {
        res(chain[arg]);
      });
    });
  });

  describe('actions', () => {
    describe('getCount', () => {
      it('should return count from blockchain state', async () => {
        const count = await countModule.actions.getCount({ module, address });
        expect(count).toEqual(countChain);
      });

      it('should return undefined if data is not exist in blockchain', async () => {
        const count = await countModule.actions.getCount({
          module: 'unknown',
          address: Buffer.alloc(0),
        });
        expect(count).toBeUndefined();
      });

      it('should throw an error if module is not string', async () => {
        const count = async () => {
          try {
            await countModule.actions.getCount({ module: 3, address });
            return true;
          } catch {
            return false;
          }
        };
        expect(await count()).toBe(false);
      });

      it('should throw an error if module length exceed limit', async () => {
        const count = async () => {
          try {
            await countModule.actions.getCount({
              module: 'a'.repeat(KEY_STRING_MAX_LENGTH + 1),
              address,
            });
            return true;
          } catch {
            return false;
          }
        };
        expect(await count()).toBe(false);
      });

      it('should throw an error if address is not buffer', async () => {
        const count = async () => {
          try {
            await countModule.actions.getCount({ module, address: 3 });
            return true;
          } catch {
            return false;
          }
        };
        expect(await count()).toBe(false);
      });

      it('should throw an error if address length exceed limit', async () => {
        const count = async () => {
          try {
            await countModule.actions.getCount({
              module,
              address: Buffer.alloc(ADDRESS_BYTES_MAX_LENGTH + 1),
            });
            return true;
          } catch {
            return false;
          }
        };
        expect(await count()).toBe(false);
      });
    });

    describe('getCountItem', () => {
      it('should return count item from blockchain state', async () => {
        const countItem = await countModule.actions.getCountItem({ module, key, address });
        expect(countItem).toEqual(countItemChain);
      });

      it('should return undefined if data is not exist in blockchain', async () => {
        const countItem = await countModule.actions.getCountItem({
          module: 'unknown',
          key: 'unknown',
          address: Buffer.alloc(0),
        });
        expect(countItem).toBeUndefined();
      });

      it('should throw an error if module is not string', async () => {
        const countItem = async () => {
          try {
            await countModule.actions.getCountItem({ module: 3, key, address });
            return true;
          } catch {
            return false;
          }
        };
        expect(await countItem()).toBe(false);
      });

      it('should throw an error if module length exceed limit', async () => {
        const countItem = async () => {
          try {
            await countModule.actions.getCountItem({
              module: 'a'.repeat(KEY_STRING_MAX_LENGTH + 1),
              key,
              address,
            });
            return true;
          } catch {
            return false;
          }
        };
        expect(await countItem()).toBe(false);
      });

      it('should throw an error if key is not string', async () => {
        const countItem = async () => {
          try {
            await countModule.actions.getCountItem({ module, key: 3, address });
            return true;
          } catch {
            return false;
          }
        };
        expect(await countItem()).toBe(false);
      });

      it('should throw an error if key length exceed limit', async () => {
        const countItem = async () => {
          try {
            await countModule.actions.getCountItem({
              module,
              key: 'a'.repeat(KEY_STRING_MAX_LENGTH + 1),
              address,
            });
            return true;
          } catch {
            return false;
          }
        };
        expect(await countItem()).toBe(false);
      });

      it('should throw an error if address is not buffer', async () => {
        const countItem = async () => {
          try {
            await countModule.actions.getCountItem({ module, key, address: 3 });
            return true;
          } catch {
            return false;
          }
        };
        expect(await countItem()).toBe(false);
      });

      it('should throw an error if address length exceed limit', async () => {
        const countItem = async () => {
          try {
            await countModule.actions.getCountItem({
              module,
              key,
              address: Buffer.alloc(ADDRESS_BYTES_MAX_LENGTH + 1),
            });
            return true;
          } catch {
            return false;
          }
        };
        expect(await countItem()).toBe(false);
      });
    });
  });

  describe('reducers', () => {
    describe('getCount', () => {
      it('should return count from blockchain state', async () => {
        const count = await countModule.reducers.getCount({ module, address }, stateStore);
        expect(count).toEqual(countChain);
      });

      it('should return undefined if data is not exist in blockchain', async () => {
        const count = await countModule.reducers.getCount(
          {
            module: 'unknown',
            address: Buffer.alloc(0),
          },
          stateStore,
        );
        expect(count).toBeUndefined();
      });

      it('should throw an error if module is not string', async () => {
        const count = async () => {
          try {
            await countModule.reducers.getCount({ module: 3, address }, stateStore);
            return true;
          } catch {
            return false;
          }
        };
        expect(await count()).toBe(false);
      });

      it('should throw an error if module length exceed limit', async () => {
        const count = async () => {
          try {
            await countModule.reducers.getCount(
              {
                module: 'a'.repeat(KEY_STRING_MAX_LENGTH + 1),
                address,
              },
              stateStore,
            );
            return true;
          } catch {
            return false;
          }
        };
        expect(await count()).toBe(false);
      });

      it('should throw an error if address is not buffer', async () => {
        const count = async () => {
          try {
            await countModule.reducers.getCount({ module, address: 3 }, stateStore);
            return true;
          } catch {
            return false;
          }
        };
        expect(await count()).toBe(false);
      });

      it('should throw an error if address length exceed limit', async () => {
        const count = async () => {
          try {
            await countModule.reducers.getCount(
              {
                module,
                address: Buffer.alloc(ADDRESS_BYTES_MAX_LENGTH + 1),
              },
              stateStore,
            );
            return true;
          } catch {
            return false;
          }
        };
        expect(await count()).toBe(false);
      });
    });

    describe('getCountItem', () => {
      it('should return count item from blockchain state', async () => {
        const countItem = await countModule.reducers.getCountItem(
          { module, key, address },
          stateStore,
        );
        expect(countItem).toEqual(countItemChain);
      });

      it('should return undefined if data is not exist in blockchain', async () => {
        const countItem = await countModule.reducers.getCountItem(
          {
            module: 'unknown',
            key: 'unknown',
            address: Buffer.alloc(0),
          },
          stateStore,
        );
        expect(countItem).toBeUndefined();
      });

      it('should throw an error if module is not string', async () => {
        const countItem = async () => {
          try {
            await countModule.reducers.getCountItem({ module: 3, key, address }, stateStore);
            return true;
          } catch {
            return false;
          }
        };
        expect(await countItem()).toBe(false);
      });

      it('should throw an error if module length exceed limit', async () => {
        const countItem = async () => {
          try {
            await countModule.reducers.getCountItem(
              {
                module: 'a'.repeat(KEY_STRING_MAX_LENGTH + 1),
                key,
                address,
              },
              stateStore,
            );
            return true;
          } catch {
            return false;
          }
        };
        expect(await countItem()).toBe(false);
      });

      it('should throw an error if key is not string', async () => {
        const countItem = async () => {
          try {
            await countModule.reducers.getCountItem({ module, key: 3, address }, stateStore);
            return true;
          } catch {
            return false;
          }
        };
        expect(await countItem()).toBe(false);
      });

      it('should throw an error if key length exceed limit', async () => {
        const countItem = async () => {
          try {
            await countModule.reducers.getCountItem(
              {
                module,
                key: 'a'.repeat(KEY_STRING_MAX_LENGTH + 1),
                address,
              },
              stateStore,
            );
            return true;
          } catch {
            return false;
          }
        };
        expect(await countItem()).toBe(false);
      });

      it('should throw an error if address is not buffer', async () => {
        const countItem = async () => {
          try {
            await countModule.reducers.getCountItem({ module, key, address: 3 }, stateStore);
            return true;
          } catch {
            return false;
          }
        };
        expect(await countItem()).toBe(false);
      });

      it('should throw an error if address length exceed limit', async () => {
        const countItem = async () => {
          try {
            await countModule.reducers.getCountItem(
              {
                module,
                key,
                address: Buffer.alloc(ADDRESS_BYTES_MAX_LENGTH + 1),
              },
              stateStore,
            );
            return true;
          } catch {
            return false;
          }
        };
        expect(await countItem()).toBe(false);
      });
    });

    describe('addCount', () => {
      it('should add total count to existing value', async () => {
        await countModule.reducers.addCount({ module, key, address, item }, stateStore);
        const count = await countModule.reducers.getCount({ module, address }, stateStore);
        expect(count).toEqual({ total: countChain.total + 1 });
      });

      it('should add total count for new value', async () => {
        await countModule.reducers.addCount({ module: 'new', key, address, item }, stateStore);
        const count = await countModule.reducers.getCount({ module: 'new', address }, stateStore);
        expect(count).toEqual({ total: 1 });
      });

      it('should new item to existing value', async () => {
        await countModule.reducers.addCount({ module, key, address, item }, stateStore);
        const countItem = await countModule.reducers.getCountItem(
          { module, key, address },
          stateStore,
        );
        expect(countItem).toEqual({ items: [item, ...countItemChain.items] });
      });

      it('should new item to new value', async () => {
        await countModule.reducers.addCount({ module: 'new', key, address, item }, stateStore);
        const countItem = await countModule.reducers.getCountItem(
          { module: 'new', key, address },
          stateStore,
        );
        expect(countItem).toEqual({ items: [item] });
      });
      it('should return true for successful operation', async () => {
        const res = await countModule.reducers.addCount({ module, key, address, item }, stateStore);
        expect(res).toBe(true);
      });

      it('should return false if module is not string', async () => {
        const res = await countModule.reducers.addCount(
          { module: 3, key, address, item },
          stateStore,
        );
        expect(res).toBe(false);
      });

      it('should return false if module length exceed limit', async () => {
        const res = await countModule.reducers.addCount(
          {
            module: 'a'.repeat(KEY_STRING_MAX_LENGTH + 1),
            key,
            address,
            item,
          },
          stateStore,
        );
        expect(res).toBe(false);
      });

      it('should return false if key is not string', async () => {
        const res = await countModule.reducers.addCount(
          { module, key: 3, address, item },
          stateStore,
        );
        expect(res).toBe(false);
      });

      it('should return false if key length exceed limit', async () => {
        const res = await countModule.reducers.addCount(
          {
            module,
            key: 'a'.repeat(KEY_STRING_MAX_LENGTH + 1),
            address,
            item,
          },
          stateStore,
        );
        expect(res).toBe(false);
      });

      it('should return false if address is not buffer', async () => {
        const res = await countModule.reducers.addCount(
          { module, key, address: 3, item },
          stateStore,
        );
        expect(res).toBe(false);
      });

      it('should return false if address length exceed limit', async () => {
        const res = await countModule.reducers.addCount(
          {
            module,
            key,
            address: Buffer.alloc(ADDRESS_BYTES_MAX_LENGTH + 1),
            item,
          },
          stateStore,
        );
        expect(res).toBe(false);
      });

      it('should return false if item is not buffer', async () => {
        const res = await countModule.reducers.addCount(
          { module, key, address, item: 3 },
          stateStore,
        );
        expect(res).toBe(false);
      });

      it('should return false if item length exceed limit', async () => {
        const res = await countModule.reducers.addCount(
          {
            module,
            key,
            address,
            item: Buffer.alloc(ADDRESS_BYTES_MAX_LENGTH + 1),
          },
          stateStore,
        );
        expect(res).toBe(false);
      });
    });
  });

  describe('constructor', () => {
    it('should have valid id', () => {
      expect(countModule.id).toBe(COUNT_MODULE_ID);
    });
    it('should have valid name', () => {
      expect(countModule.name).toBe(COUNT_PREFIX);
    });
  });

  describe('afterBlockApply', () => {
    it('should do nothing and not throw error', () => {
      const dummy = {};
      const func = async () => countModule.afterBlockApply(dummy as any);
      expect(func).not.toThrow();
    });
  });

  describe('beforeBlockApply', () => {
    it('should do nothing and not throw error', () => {
      const dummy = {};
      const func = async () => countModule.beforeBlockApply(dummy as any);
      expect(func).not.toThrow();
    });
  });

  describe('beforeTransactionApply', () => {
    it('should do nothing and not throw error', () => {
      const dummy = {};
      const func = async () => countModule.beforeTransactionApply(dummy as any);
      expect(func).not.toThrow();
    });
  });

  describe('afterTransactionApply', () => {
    it('should do nothing and not throw error', () => {
      const dummy = {};
      const func = async () => countModule.afterTransactionApply(dummy as any);
      expect(func).not.toThrow();
    });
  });

  describe('afterGenesisBlockApply', () => {
    it('should do nothing and not throw error', () => {
      const dummy = {};
      const func = async () => countModule.afterGenesisBlockApply(dummy as any);
      expect(func).not.toThrow();
    });
  });
});
