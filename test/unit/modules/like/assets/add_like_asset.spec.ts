import { AddLikeProps } from 'enevti-types/asset/like/add_like_asset';
import { LikeChain, LikedChain } from 'enevti-types/chain/like';
import { codec, ReducerHandler, StateStore, testing } from 'lisk-sdk';
import { COUNT_PREFIX } from '../../../../../src/app/modules/count/constants/codec';
import { AddLikeAsset } from '../../../../../src/app/modules/like/assets/add_like_asset';
import {
  ADD_LIKE_ASSET_NAME,
  LIKED_PREFIX,
  LIKE_MODULE_PREFIX,
  LIKE_PREFIX,
} from '../../../../../src/app/modules/like/constants/codec';
import { ADD_LIKE_ASSET_ID } from '../../../../../src/app/modules/like/constants/id';
import {
  IDENTIFIER_MAX_LENGTH,
  ID_MAX_LENGTH,
} from '../../../../../src/app/modules/like/constants/limit';
import { addLikeSchema } from '../../../../../src/app/modules/like/schema/assets/add_like_assets';
import { likeSchema } from '../../../../../src/app/modules/like/schema/like';
import { likedSchema } from '../../../../../src/app/modules/like/schema/liked';
import { getLike } from '../../../../../src/app/modules/like/utils/like';
import { getLiked } from '../../../../../src/app/modules/like/utils/liked';

describe('AddLikeAsset', () => {
  let transactionAsset: AddLikeAsset;

  beforeEach(() => {
    transactionAsset = new AddLikeAsset();
  });

  describe('constructor', () => {
    it('should have valid id', () => {
      expect(transactionAsset.id).toEqual(ADD_LIKE_ASSET_ID);
    });

    it('should have valid name', () => {
      expect(transactionAsset.name).toEqual(ADD_LIKE_ASSET_NAME);
    });

    it('should have valid schema', () => {
      expect(transactionAsset.schema).toEqual(addLikeSchema);
    });
  });

  describe('validate', () => {
    describe('schema validation', () => {
      it('should throw error if identifier length exceeding limit', () => {
        const context = testing.createValidateAssetContext<AddLikeProps>({
          asset: { identifier: 'a'.repeat(IDENTIFIER_MAX_LENGTH + 1), id: 'id' },
          transaction: { senderAddress: Buffer.alloc(0) } as any,
        });
        expect(() => transactionAsset.validate(context)).toThrow();
      });

      it('should throw error if id length exceeding limit', () => {
        const context = testing.createValidateAssetContext<AddLikeProps>({
          asset: { identifier: 'identifier', id: 'a'.repeat(ID_MAX_LENGTH + 1) },
          transaction: { senderAddress: Buffer.alloc(0) } as any,
        });
        expect(() => transactionAsset.validate(context)).toThrow();
      });

      it('should be ok for valid schema', () => {
        const context = testing.createValidateAssetContext<AddLikeProps>({
          asset: { id: 'id', identifier: 'identifier' },
          transaction: { senderAddress: Buffer.alloc(0) } as any,
        });
        expect(() => transactionAsset.validate(context)).not.toThrow();
      });
    });
  });

  describe('apply', () => {
    let stateStore: StateStore;
    let context;

    const reducerHandler: ReducerHandler = testing.mocks.reducerHandlerMock;
    const identifier = 'identifier';
    const target = 'target';
    const { address } = testing.fixtures.defaultFaucetAccount;
    const likeChain: LikeChain = {
      address: [address],
    };
    const likedChain: LikedChain = {
      status: 1,
    };
    const likeChainValue = codec.encode(likeSchema, likeChain);
    const likedChainValue = codec.encode(likedSchema, likedChain);

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

      context = testing.createApplyAssetContext<AddLikeProps>({
        stateStore,
        reducerHandler,
        asset: { identifier, id: target },
        transaction: { senderAddress: address, nonce: BigInt(1) } as any,
      });

      jest.spyOn(reducerHandler, 'invoke');
      jest.spyOn(stateStore.chain, 'get');
      jest.spyOn(stateStore.chain, 'set');
    });

    it('should add like to blockchain state', async () => {
      context = testing.createApplyAssetContext<AddLikeProps>({
        stateStore,
        reducerHandler,
        asset: { identifier: 'newIdentifier', id: 'newTarget' },
        transaction: { senderAddress: address, nonce: BigInt(1) } as any,
      });

      await transactionAsset.apply(context);

      const like = await getLike(stateStore, context.asset.identifier, context.asset.id);
      expect(like).toEqual(likeChain);
    });

    it('should throw an error if sender already give a like', async () => {
      const func = async () => {
        try {
          await transactionAsset.apply(context);
          return true;
        } catch {
          return false;
        }
      };
      expect(await func()).toBe(false);
    });

    it('should set liked to 1 if sender has not been give a like', async () => {
      context = testing.createApplyAssetContext<AddLikeProps>({
        stateStore,
        reducerHandler,
        asset: { identifier: 'newIdentifier', id: 'newTarget' },
        transaction: { senderAddress: address, nonce: BigInt(1) } as any,
      });

      await transactionAsset.apply(context);

      const liked = await getLiked(stateStore, context.asset.id, context.transaction.senderAddress);
      expect(liked).toEqual({ status: 1 });
    });

    it('should unshift new like target data to blockchain', async () => {
      const senderAddress = Buffer.from('newAddress', 'utf-8');
      context = testing.createApplyAssetContext<AddLikeProps>({
        stateStore,
        reducerHandler,
        asset: { identifier, id: target },
        transaction: { senderAddress, nonce: BigInt(1) } as any,
      });

      await transactionAsset.apply(context);

      const like = await getLike(stateStore, context.asset.identifier, context.asset.id);
      expect(like).toEqual({ address: [senderAddress, ...likeChain.address] });
    });

    it('should only contain new target data for the first time', async () => {
      const senderAddress = Buffer.from('newAddress', 'utf-8');
      context = testing.createApplyAssetContext<AddLikeProps>({
        stateStore,
        reducerHandler,
        asset: { identifier: 'newIdentifier', id: 'newTarget' },
        transaction: { senderAddress, nonce: BigInt(1) } as any,
      });

      await transactionAsset.apply(context);

      const like = await getLike(stateStore, context.asset.identifier, context.asset.id);

      expect(like).toEqual({ address: [senderAddress] });
    });

    it('should invoke count module addCount reducers for succesful add like operation', async () => {
      context = testing.createApplyAssetContext<AddLikeProps>({
        stateStore,
        reducerHandler,
        asset: { identifier: 'newIdentifier', id: 'newTarget' },
        transaction: { senderAddress: address, nonce: BigInt(1) } as any,
      });

      await transactionAsset.apply(context);

      expect(reducerHandler.invoke).toHaveBeenCalledWith(`${COUNT_PREFIX}:addCount`, {
        module: LIKE_MODULE_PREFIX,
        key: 'newIdentifier',
        address,
        item: Buffer.from('newTarget', 'hex'),
      });
    });
  });
});
