import { LikeChain, LikedChain } from 'enevti-types/chain/like';
import {
  ADDRESS_BYTES_MAX_LENGTH,
  ID_STRING_MAX_LENGTH,
  KEY_STRING_MAX_LENGTH,
} from 'enevti-types/constant/validation';
import { GetLikedParam, GetLikeParam } from 'enevti-types/param/like';
import { ModuleInfo } from 'enevti-types/utils/moduleInfo';
import { BaseModule } from 'lisk-framework';
import { likeModuleInfo } from '../constants/info';
import { accessLike } from '../utils/like';
import { accessLiked } from '../utils/liked';

export function likeActions(this: BaseModule) {
  return {
    getInfo: (): ModuleInfo => likeModuleInfo,
    getLike: async (params): Promise<LikeChain | undefined> => {
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
      const like = await accessLike(this._dataAccess, identifier, target);
      return like;
    },
    getLiked: async (params): Promise<LikedChain | undefined> => {
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
      const liked = await accessLiked(this._dataAccess, target, address);
      return liked;
    },
  };
}
