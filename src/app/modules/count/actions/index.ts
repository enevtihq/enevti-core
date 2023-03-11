import { CountChain, CountItemChain } from 'enevti-types/chain/count';
import { GetCountItemParam, GetCountParam } from 'enevti-types/param/count';
import { BaseModule } from 'lisk-framework';
import { ADDRESS_BYTES_MAX_LENGTH, KEY_STRING_MAX_LENGTH } from 'enevti-types/constant/validation';
import { accessCount } from '../utils/count';
import { accessCountItem } from '../utils/item';

export function countActions(this: BaseModule) {
  return {
    getCount: async (params): Promise<CountChain | undefined> => {
      const { module, address } = params as GetCountParam;
      if (typeof module !== 'string') {
        throw new Error('module must be a string');
      }
      if (module.length > KEY_STRING_MAX_LENGTH) {
        throw new Error(`maximum module length is ${KEY_STRING_MAX_LENGTH}`);
      }
      if (!Buffer.isBuffer(address)) {
        throw new Error('address must be a buffer');
      }
      if (address.length > ADDRESS_BYTES_MAX_LENGTH) {
        throw new Error(`maximum address length is ${ADDRESS_BYTES_MAX_LENGTH}`);
      }
      const count = await accessCount(this._dataAccess, module, address);
      return count;
    },
    getCountItem: async (params): Promise<CountItemChain | undefined> => {
      const { module, key, address } = params as GetCountItemParam;
      if (typeof module !== 'string') {
        throw new Error('module must be a string');
      }
      if (module.length > KEY_STRING_MAX_LENGTH) {
        throw new Error(`maximum module length is ${KEY_STRING_MAX_LENGTH}`);
      }
      if (typeof key !== 'string') {
        throw new Error('key must be a string');
      }
      if (key.length > KEY_STRING_MAX_LENGTH) {
        throw new Error(`maximum key length is ${KEY_STRING_MAX_LENGTH}`);
      }
      if (!Buffer.isBuffer(address)) {
        throw new Error('address must be a buffer');
      }
      if (address.length > ADDRESS_BYTES_MAX_LENGTH) {
        throw new Error(`maximum address length is ${ADDRESS_BYTES_MAX_LENGTH}`);
      }
      const countItem = await accessCountItem(this._dataAccess, module, key, address);
      return countItem;
    },
  };
}
