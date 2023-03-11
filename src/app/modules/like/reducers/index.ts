import { StateStore, BaseModule } from 'lisk-framework';
import { LikeChain, LikedChain } from 'enevti-types/chain/like';
import { AddLikeParam, GetLikedParam, GetLikeParam } from 'enevti-types/param/like';
import { ModuleInfo } from 'enevti-types/utils/moduleInfo';
import {
  ADDRESS_BYTES_MAX_LENGTH,
  ID_STRING_MAX_LENGTH,
  KEY_STRING_MAX_LENGTH,
} from 'enevti-types/constant/validation';
import { getLike } from '../utils/like';
import { addLike } from '../utils/add';
import { getLiked } from '../utils/liked';
import { likeModuleInfo } from '../constants/info';

export function likeReducers(this: BaseModule) {
  return {
    getInfo: (): ModuleInfo => likeModuleInfo,
    getLike: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<LikeChain | undefined> => {
      const { identifier, target } = params as GetLikeParam;
      if (typeof identifier !== 'string') {
        throw new Error('identifier must be a string');
      }
      if (identifier.length > KEY_STRING_MAX_LENGTH) {
        throw new Error(`maximum identifier length is ${KEY_STRING_MAX_LENGTH}`);
      }
      if (typeof target !== 'string') {
        throw new Error('target must be a string');
      }
      if (target.length > ID_STRING_MAX_LENGTH) {
        throw new Error(`maximum target length is ${ID_STRING_MAX_LENGTH}`);
      }
      const like = await getLike(stateStore, identifier, target);
      return like;
    },
    getLiked: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<LikedChain | undefined> => {
      const { target, address } = params as GetLikedParam;
      if (typeof target !== 'string') {
        throw new Error('target must be a string');
      }
      if (target.length > ID_STRING_MAX_LENGTH) {
        throw new Error(`maximum target length is ${ID_STRING_MAX_LENGTH}`);
      }
      if (!Buffer.isBuffer(address)) {
        throw new Error('address must be a buffer');
      }
      if (address.length > ADDRESS_BYTES_MAX_LENGTH) {
        throw new Error(`maximum address length is ${ADDRESS_BYTES_MAX_LENGTH}`);
      }
      const liked = await getLiked(stateStore, target, address);
      return liked;
    },
    addLike: async (params: Record<string, unknown>, stateStore: StateStore): Promise<boolean> => {
      try {
        const { reducerHandler, identifier, target, senderAddress } = params as AddLikeParam;
        if (!reducerHandler || reducerHandler.invoke === undefined) {
          throw new Error('reducerHandler is invalid');
        }
        if (typeof identifier !== 'string') {
          throw new Error('identifier must be a string');
        }
        if (identifier.length > KEY_STRING_MAX_LENGTH) {
          throw new Error(`maximum identifier length is ${KEY_STRING_MAX_LENGTH}`);
        }
        if (typeof target !== 'string') {
          throw new Error('target must be a string');
        }
        if (target.length > ID_STRING_MAX_LENGTH) {
          throw new Error(`maximum target length is ${ID_STRING_MAX_LENGTH}`);
        }
        if (!Buffer.isBuffer(senderAddress)) {
          throw new Error('senderAddress must be a buffer');
        }
        if (senderAddress.length > ADDRESS_BYTES_MAX_LENGTH) {
          throw new Error(`maximum senderAddress length is ${ADDRESS_BYTES_MAX_LENGTH}`);
        }
        await addLike(stateStore, reducerHandler, identifier, target, senderAddress);
        return true;
      } catch {
        return false;
      }
    },
  };
}
