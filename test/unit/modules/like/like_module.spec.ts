import { LikeChain, LikedChain } from 'enevti-types/chain/like';
import { AddCountParam } from 'enevti-types/param/count';
import { NewLikeEvent } from 'enevti-types/param/like';
import { codec, StateStore, testing } from 'lisk-sdk';
import { LIKE_MODULE_ID } from 'enevti-types/constant/id';
import { COUNT_PREFIX } from '../../../../src/app/modules/count/constants/codec';
import { AddLikeAsset } from '../../../../src/app/modules/like/assets/add_like_asset';
import {
  LIKED_PREFIX,
  LIKE_MODULE_PREFIX,
  LIKE_PREFIX,
} from '../../../../src/app/modules/like/constants/codec';
import { likeModuleInfo } from '../../../../src/app/modules/like/constants/info';
import {
  IDENTIFIER_MAX_LENGTH,
  ID_MAX_LENGTH,
  ADDRESS_MAX_LENGTH,
} from '../../../../src/app/modules/like/constants/limit';
import { LikeModule } from '../../../../src/app/modules/like/like_module';
import { likeSchema } from '../../../../src/app/modules/like/schema/like';
import { likedSchema } from '../../../../src/app/modules/like/schema/liked';

describe('LikeModule', () => {
  let stateStore: StateStore;
  let context;

  const likeModule: LikeModule = new LikeModule(testing.fixtures.defaultConfig.genesisConfig);
  const channel = testing.mocks.channelMock;
  const reducerHandler = testing.mocks.reducerHandlerMock;

  const identifier = 'identifier';
  const target = 'target';
  const id = target;
  const { passphrase, address } = testing.fixtures.defaultFaucetAccount;
  const likeChain: LikeChain = {
    address: [address],
  };
  const likedChain: LikedChain = {
    status: 1,
  };
  const likeChainValue = codec.encode(likeSchema, likeChain);
  const likedChainValue = codec.encode(likedSchema, likedChain);

  likeModule.init({
    channel,
    logger: testing.mocks.loggerMock,
    dataAccess: new testing.mocks.DataAccessMock(),
  });

  beforeEach(() => {
    const chain = {
      [`${LIKE_MODULE_PREFIX}:${identifier}:${target}:${LIKE_PREFIX}`]: likeChainValue,
      [`${LIKE_MODULE_PREFIX}:${LIKED_PREFIX}:${target}:${address.toString(
        'hex',
      )}`]: likedChainValue,
    };

    stateStore = new testing.mocks.StateStoreMock({
      chain,
    });

    jest.spyOn(channel, 'publish');
    jest.spyOn(reducerHandler, 'invoke');
    jest.spyOn(stateStore.chain, 'get');
    jest.spyOn(stateStore.chain, 'set');

    jest.spyOn(likeModule['_dataAccess'], 'getChainState').mockImplementation(async key => {
      return new Promise(res => {
        res(chain[key]);
      });
    });
  });

  describe('constructor', () => {
    it('should have valid id', () => {
      expect(likeModule.id).toBe(LIKE_MODULE_ID);
    });
    it('should have valid name', () => {
      expect(likeModule.name).toBe(LIKE_MODULE_PREFIX);
    });
  });

  describe('afterTransactionApply', () => {
    it('should publish newRegistrar newLike', async () => {
      context = testing.createTransactionApplyContext({
        stateStore,
        transaction: testing.createTransaction({
          moduleID: LIKE_MODULE_ID,
          assetClass: AddLikeAsset,
          asset: { id, identifier },
          nonce: BigInt(0),
          fee: BigInt('10000000'),
          passphrase,
          networkIdentifier: Buffer.from(
            'e48feb88db5b5cf5ad71d93cdcd1d879b6d5ed187a36b0002cc34e0ef9883255',
            'hex',
          ),
        }),
      });
      await likeModule.afterTransactionApply(context);
      const eventPayload: NewLikeEvent = {
        identifier,
        id,
        senderAddress: address,
      };
      expect(channel.publish).toHaveBeenCalledWith(`${LIKE_PREFIX}:newLike`, eventPayload);
    });
  });

  describe('actions', () => {
    describe('getInfo', () => {
      it('should return module id, schema, and other module info', async () => {
        const info = await likeModule.actions.getInfo();
        expect(info).toEqual(likeModuleInfo);
      });
    });

    describe('getLike', () => {
      it('should return like data from blockchain', async () => {
        const like = await likeModule.actions.getLike({ identifier, target });
        expect(like).toEqual(likeChain);
      });

      it('should return undefined if data is not exist', async () => {
        const like = await likeModule.actions.getLike({ identifier: 'unknown', target: 'unknown' });
        expect(like).toBeUndefined();
      });

      it('should throw an error if identifier is not string', async () => {
        const like = async () => {
          try {
            await likeModule.actions.getLike({ identifier: 3, target });
            return true;
          } catch {
            return false;
          }
        };
        expect(await like()).toBe(false);
      });

      it('should throw an error if identifier length is exceeding limit', async () => {
        const like = async () => {
          try {
            await likeModule.actions.getLike({
              identifier: 'a'.repeat(IDENTIFIER_MAX_LENGTH + 1),
              target,
            });
            return true;
          } catch {
            return false;
          }
        };
        expect(await like()).toBe(false);
      });

      it('should throw an error if target is not string', async () => {
        const like = async () => {
          try {
            await likeModule.actions.getLike({ identifier, target: 3 });
            return true;
          } catch {
            return false;
          }
        };
        expect(await like()).toBe(false);
      });
      it('should throw an error if target length is exceeding limit', async () => {
        const like = async () => {
          try {
            await likeModule.actions.getLike({ identifier, target: 'a'.repeat(ID_MAX_LENGTH + 1) });
            return true;
          } catch {
            return false;
          }
        };
        expect(await like()).toBe(false);
      });
    });

    describe('getLiked', () => {
      it('should return like data from blockchain', async () => {
        const liked = await likeModule.actions.getLiked({ target, address });
        expect(liked).toEqual(likedChain);
      });

      it('should return undefined if data is not exist', async () => {
        const liked = await likeModule.actions.getLiked({ target: 'unknown', address });
        expect(liked).toBeUndefined();
      });

      it('should throw an error if target is not string', async () => {
        const liked = async () => {
          try {
            await likeModule.actions.getLiked({ target: 3, address });
            return true;
          } catch {
            return false;
          }
        };
        expect(await liked()).toBe(false);
      });

      it('should throw an error if target length is exceeding limit', async () => {
        const liked = async () => {
          try {
            await likeModule.actions.getLiked({ target: 'a'.repeat(ID_MAX_LENGTH + 1), address });
            return true;
          } catch {
            return false;
          }
        };
        expect(await liked()).toBe(false);
      });

      it('should throw an error if address is not buffer', async () => {
        const liked = async () => {
          try {
            await likeModule.actions.getLiked({ target, address: 3 });
            return true;
          } catch {
            return false;
          }
        };
        expect(await liked()).toBe(false);
      });

      it('should throw an error if address is exceeding limit', async () => {
        const liked = async () => {
          try {
            await likeModule.actions.getLiked({
              target,
              address: Buffer.alloc(ADDRESS_MAX_LENGTH + 1),
            });
            return true;
          } catch {
            return false;
          }
        };
        expect(await liked()).toBe(false);
      });
    });
  });

  describe('reducers', () => {
    describe('getInfo', () => {
      it('should return module id, schema, and other module info', async () => {
        const info = await likeModule.reducers.getInfo(undefined, stateStore);
        expect(info).toEqual(likeModuleInfo);
      });
    });

    describe('getLike', () => {
      it('should return like data from blockchain', async () => {
        const like = await likeModule.reducers.getLike({ identifier, target }, stateStore);
        expect(like).toEqual(likeChain);
      });

      it('should return undefined if data is not exist', async () => {
        const like = await likeModule.reducers.getLike(
          { identifier: 'unknown', target: 'unknown' },
          stateStore,
        );
        expect(like).toBeUndefined();
      });

      it('should throw an error if identifier is not string', async () => {
        const like = async () => {
          try {
            await likeModule.reducers.getLike({ identifier: 3, target }, stateStore);
            return true;
          } catch {
            return false;
          }
        };
        expect(await like()).toBe(false);
      });

      it('should throw an error if identifier length is exceeding limit', async () => {
        const like = async () => {
          try {
            await likeModule.reducers.getLike(
              {
                identifier: 'a'.repeat(IDENTIFIER_MAX_LENGTH + 1),
                target,
              },
              stateStore,
            );
            return true;
          } catch {
            return false;
          }
        };
        expect(await like()).toBe(false);
      });

      it('should throw an error if target is not string', async () => {
        const like = async () => {
          try {
            await likeModule.reducers.getLike({ identifier, target: 3 }, stateStore);
            return true;
          } catch {
            return false;
          }
        };
        expect(await like()).toBe(false);
      });
      it('should throw an error if target length is exceeding limit', async () => {
        const like = async () => {
          try {
            await likeModule.reducers.getLike(
              { identifier, target: 'a'.repeat(ID_MAX_LENGTH + 1) },
              stateStore,
            );
            return true;
          } catch {
            return false;
          }
        };
        expect(await like()).toBe(false);
      });
    });

    describe('getLiked', () => {
      it('should return like data from blockchain', async () => {
        const liked = await likeModule.reducers.getLiked({ target, address }, stateStore);
        expect(liked).toEqual(likedChain);
      });

      it('should return undefined if data is not exist', async () => {
        const liked = await likeModule.reducers.getLiked(
          { target: 'unknown', address },
          stateStore,
        );
        expect(liked).toBeUndefined();
      });

      it('should throw an error if target is not string', async () => {
        const liked = async () => {
          try {
            await likeModule.reducers.getLiked({ target: 3, address }, stateStore);
            return true;
          } catch {
            return false;
          }
        };
        expect(await liked()).toBe(false);
      });

      it('should throw an error if target length is exceeding limit', async () => {
        const liked = async () => {
          try {
            await likeModule.reducers.getLiked(
              { target: 'a'.repeat(ID_MAX_LENGTH + 1), address },
              stateStore,
            );
            return true;
          } catch {
            return false;
          }
        };
        expect(await liked()).toBe(false);
      });

      it('should throw an error if address is not buffer', async () => {
        const liked = async () => {
          try {
            await likeModule.reducers.getLiked({ target, address: 3 }, stateStore);
            return true;
          } catch {
            return false;
          }
        };
        expect(await liked()).toBe(false);
      });

      it('should throw an error if address is exceeding limit', async () => {
        const liked = async () => {
          try {
            await likeModule.reducers.getLiked(
              {
                target,
                address: Buffer.alloc(ADDRESS_MAX_LENGTH + 1),
              },
              stateStore,
            );
            return true;
          } catch {
            return false;
          }
        };
        expect(await liked()).toBe(false);
      });
    });

    describe('addLike', () => {
      it('should add like to blockchain state', async () => {
        const newIdentifier = 'newIdentifier';
        const newTarget = 'newTarget';
        await likeModule.reducers.addLike(
          {
            reducerHandler,
            identifier: newIdentifier,
            target: newTarget,
            senderAddress: address,
          },
          stateStore,
        );
        const like = await likeModule.reducers.getLike(
          { identifier: newIdentifier, target: newTarget },
          stateStore,
        );
        expect(like).toEqual(likeChain);
      });

      it('should return false if sender already give a like', async () => {
        const add = await likeModule.reducers.addLike(
          {
            reducerHandler,
            identifier,
            target,
            senderAddress: address,
          },
          stateStore,
        );
        expect(add).toBe(false);
      });

      it('should set liked to 1 if sender has not been give a like', async () => {
        const newIdentifier = 'newIdentifier';
        const newTarget = 'newTarget';
        await likeModule.reducers.addLike(
          {
            reducerHandler,
            identifier: newIdentifier,
            target: newTarget,
            senderAddress: address,
          },
          stateStore,
        );
        const liked = await likeModule.reducers.getLiked(
          { target: newTarget, address },
          stateStore,
        );
        expect(liked).toEqual({ status: 1 });
      });

      it('should unshift new like target data to blockchain', async () => {
        const senderAddress = Buffer.from('newAddress', 'utf-8');
        await likeModule.reducers.addLike(
          {
            reducerHandler,
            identifier,
            target,
            senderAddress,
          },
          stateStore,
        );
        const like = await likeModule.reducers.getLike({ identifier, target }, stateStore);
        expect(like).toEqual({ address: [senderAddress, ...likeChain.address] });
      });

      it('should only contain new target data for the first time', async () => {
        const newIdentifier = 'newIdentifier';
        const newTarget = 'newTarget';
        const senderAddress = Buffer.from('newAddress', 'utf-8');
        await likeModule.reducers.addLike(
          {
            reducerHandler,
            identifier: newIdentifier,
            target: newTarget,
            senderAddress,
          },
          stateStore,
        );
        const like = await likeModule.reducers.getLike(
          { identifier: newIdentifier, target: newTarget },
          stateStore,
        );
        expect(like).toEqual({ address: [senderAddress] });
      });

      it('should invoke count module addCount reducers for succesful add like operation', async () => {
        await likeModule.reducers.addLike(
          {
            reducerHandler,
            identifier: 'newIdentifier',
            target: 'newIdentifier',
            senderAddress: address,
          },
          stateStore,
        );
        const payload: AddCountParam = {
          module: LIKE_MODULE_PREFIX,
          key: 'newIdentifier',
          address,
          item: Buffer.from('newIdentifier', 'hex'),
        };
        expect(reducerHandler.invoke).toHaveBeenCalledWith(`${COUNT_PREFIX}:addCount`, payload);
      });

      it('should return false if reducerHandler is undefined', async () => {
        const senderAddress = Buffer.from('newAddress', 'utf-8');
        const add = await likeModule.reducers.addLike(
          {
            identifier,
            target,
            senderAddress,
          },
          stateStore,
        );
        expect(add).toBe(false);
      });

      it('should return false if identifier is not a string', async () => {
        const senderAddress = Buffer.from('newAddress', 'utf-8');
        const add = await likeModule.reducers.addLike(
          {
            reducerHandler,
            identifier: 3,
            target,
            senderAddress,
          },
          stateStore,
        );
        expect(add).toBe(false);
      });

      it('should return false if identifier length exceeding iimit', async () => {
        const senderAddress = Buffer.from('newAddress', 'utf-8');
        const add = await likeModule.reducers.addLike(
          {
            reducerHandler,
            identifier: 'a'.repeat(IDENTIFIER_MAX_LENGTH + 1),
            target,
            senderAddress,
          },
          stateStore,
        );
        expect(add).toBe(false);
      });

      it('should return false if target is not a string', async () => {
        const senderAddress = Buffer.from('newAddress', 'utf-8');
        const add = await likeModule.reducers.addLike(
          {
            reducerHandler,
            identifier,
            target: 3,
            senderAddress,
          },
          stateStore,
        );
        expect(add).toBe(false);
      });

      it('should return false if target length exceeding limit', async () => {
        const senderAddress = Buffer.from('newAddress', 'utf-8');
        const add = await likeModule.reducers.addLike(
          {
            reducerHandler,
            identifier,
            target: 'a'.repeat(ID_MAX_LENGTH + 1),
            senderAddress,
          },
          stateStore,
        );
        expect(add).toBe(false);
      });

      it('should return false if senderAddress is not a buffer', async () => {
        const add = await likeModule.reducers.addLike(
          {
            reducerHandler,
            identifier,
            target,
            senderAddress: 3,
          },
          stateStore,
        );
        expect(add).toBe(false);
      });

      it('should return false if senderAddress length exceeding limit', async () => {
        const add = await likeModule.reducers.addLike(
          {
            reducerHandler,
            identifier,
            target,
            senderAddress: Buffer.alloc(ADDRESS_MAX_LENGTH + 1),
          },
          stateStore,
        );
        expect(add).toBe(false);
      });
    });
  });

  describe('beforeBlockApply', () => {
    it('should do nothing and not throw error', () => {
      const dummy = {};
      const func = async () => likeModule.beforeBlockApply(dummy as any);
      expect(func).not.toThrow();
    });
  });

  describe('afterBlockApply', () => {
    it('should do nothing and not throw error', () => {
      const dummy = {};
      const func = async () => likeModule.afterBlockApply(dummy as any);
      expect(func).not.toThrow();
    });
  });

  describe('beforeTransactionApply', () => {
    it('should do nothing and not throw error', () => {
      const dummy = {};
      const func = async () => likeModule.beforeTransactionApply(dummy as any);
      expect(func).not.toThrow();
    });
  });

  describe('afterGenesisBlockApply', () => {
    it('should do nothing and not throw error', () => {
      const dummy = {};
      const func = async () => likeModule.afterGenesisBlockApply(dummy as any);
      expect(func).not.toThrow();
    });
  });
});
