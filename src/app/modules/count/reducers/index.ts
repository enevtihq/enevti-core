import { StateStore, BaseModule } from 'lisk-framework';
import { CountChain, CountItemChain } from 'enevti-types/chain/count';
import { AddCountParam, GetCountItemParam, GetCountParam } from 'enevti-types/param/count';
import {
  ADDRESS_BYTES_MAX_LENGTH,
  ID_BYTES_MAX_LENGTH,
  KEY_STRING_MAX_LENGTH,
} from 'enevti-types/constant/validation';
import { getCountItem } from '../utils/item';
import { getCount } from '../utils/count';
import { addCount } from '../utils/add';

export function countReducers(this: BaseModule) {
  return {
    getCount: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<CountChain | undefined> => {
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
      const count = await getCount(stateStore, module, address);
      return count;
    },
    getCountItem: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<CountItemChain | undefined> => {
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
      const countItem = await getCountItem(stateStore, module, key, address);
      return countItem;
    },
    addCount: async (params: Record<string, unknown>, stateStore: StateStore): Promise<boolean> => {
      try {
        const { module, key, address, item } = params as AddCountParam;
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
        if (!Buffer.isBuffer(item)) {
          throw new Error('item must be a buffer');
        }
        if (item.length > ID_BYTES_MAX_LENGTH) {
          throw new Error(`maximum item length is ${ID_BYTES_MAX_LENGTH}`);
        }
        await addCount(stateStore, module, key, address, item);
        return true;
      } catch {
        return false;
      }
    },
  };
}
