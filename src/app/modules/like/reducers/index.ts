import { StateStore, BaseModule, ReducerHandler } from 'lisk-framework';
import { LikeChain, LikedChain } from 'enevti-types/chain/like';
import { ModuleInfo } from 'enevti-types/utils/moduleInfo';
import { getLike } from '../utils/like';
import { addLike } from '../utils/add';
import { getLiked } from '../utils/liked';
import { ADDRESS_MAX_LENGTH, IDENTIFIER_MAX_LENGTH, ID_MAX_LENGTH } from '../constants/limit';
import { likeModuleInfo } from '../constants/info';

export function likeReducers(this: BaseModule) {
  return {
    getInfo: (): ModuleInfo => likeModuleInfo,
    getLike: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<LikeChain | undefined> => {
      const { identifier, target } = params as Record<string, string>;
      if (typeof identifier !== 'string') {
        throw new Error('identifier must be a string');
      }
      if (identifier.length > IDENTIFIER_MAX_LENGTH) {
        throw new Error(`maximum identifier length is ${IDENTIFIER_MAX_LENGTH}`);
      }
      if (typeof target !== 'string') {
        throw new Error('target must be a string');
      }
      if (target.length > ID_MAX_LENGTH) {
        throw new Error(`maximum target length is ${ID_MAX_LENGTH}`);
      }
      const like = await getLike(stateStore, identifier, target);
      return like;
    },
    getLiked: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<LikedChain | undefined> => {
      const { target, address } = params as Record<string, string>;
      if (typeof target !== 'string') {
        throw new Error('target must be a string');
      }
      if (target.length > ID_MAX_LENGTH) {
        throw new Error(`maximum target length is ${ID_MAX_LENGTH}`);
      }
      if (!Buffer.isBuffer(address)) {
        throw new Error('address must be a buffer');
      }
      if (address.length > ADDRESS_MAX_LENGTH) {
        throw new Error(`maximum address length is ${ADDRESS_MAX_LENGTH}`);
      }
      const liked = await getLiked(stateStore, target, address);
      return liked;
    },
    addLike: async (params: Record<string, unknown>, stateStore: StateStore): Promise<boolean> => {
      try {
        const { reducerHandler, identifier, target, senderAddress } = params as {
          reducerHandler: ReducerHandler;
          identifier: string;
          target: string;
          senderAddress: Buffer;
        };
        if (!reducerHandler || reducerHandler.invoke === undefined) {
          throw new Error('reducerHandler is invalid');
        }
        if (typeof identifier !== 'string') {
          throw new Error('identifier must be a string');
        }
        if (identifier.length > IDENTIFIER_MAX_LENGTH) {
          throw new Error(`maximum identifier length is ${IDENTIFIER_MAX_LENGTH}`);
        }
        if (typeof target !== 'string') {
          throw new Error('target must be a string');
        }
        if (target.length > ID_MAX_LENGTH) {
          throw new Error(`maximum target length is ${ID_MAX_LENGTH}`);
        }
        if (!Buffer.isBuffer(senderAddress)) {
          throw new Error('senderAddress must be a buffer');
        }
        if (senderAddress.length > ADDRESS_MAX_LENGTH) {
          throw new Error(`maximum senderAddress length is ${ADDRESS_MAX_LENGTH}`);
        }
        await addLike(stateStore, reducerHandler, identifier, target, senderAddress);
        return true;
      } catch {
        return false;
      }
    },
  };
}
