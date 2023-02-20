import { StateStore, BaseModule } from 'lisk-framework';
import { CountChain, CountItemChain } from 'enevti-types/chain/count';
import { getCountItem } from '../utils/item';
import { getCount } from '../utils/count';
import { addCount } from '../utils/add';
import { ADDRESS_MAX_LENGTH, IDENTIFIER_MAX_LENGTH, ITEM_MAX_LENGTH } from '../constants/limit';

export function countReducers(this: BaseModule) {
  return {
    getCount: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<CountChain | undefined> => {
      const { identifier, address } = params as { identifier: string; address: Buffer };
      if (typeof identifier !== 'string') {
        throw new Error('identifier must be a string');
      }
      if (identifier.length > IDENTIFIER_MAX_LENGTH) {
        throw new Error(`maximum identifier length is ${IDENTIFIER_MAX_LENGTH}`);
      }
      if (!Buffer.isBuffer(address)) {
        throw new Error('address must be a buffer');
      }
      if (address.length > ADDRESS_MAX_LENGTH) {
        throw new Error(`maximum address length is ${ADDRESS_MAX_LENGTH}`);
      }
      const count = await getCount(stateStore, identifier, address);
      return count;
    },
    getCountItem: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<CountItemChain | undefined> => {
      const { identifier, address } = params as { identifier: string; address: Buffer };
      if (typeof identifier !== 'string') {
        throw new Error('identifier must be a string');
      }
      if (identifier.length > IDENTIFIER_MAX_LENGTH) {
        throw new Error(`maximum identifier length is ${IDENTIFIER_MAX_LENGTH}`);
      }
      if (!Buffer.isBuffer(address)) {
        throw new Error('address must be a buffer');
      }
      if (address.length > ADDRESS_MAX_LENGTH) {
        throw new Error(`maximum address length is ${ADDRESS_MAX_LENGTH}`);
      }
      const countItem = await getCountItem(stateStore, identifier, address);
      return countItem;
    },
    addCount: async (params: Record<string, unknown>, stateStore: StateStore): Promise<boolean> => {
      try {
        const { identifier, address, item } = params as {
          identifier: string;
          address: Buffer;
          item: Buffer;
        };
        if (typeof identifier !== 'string') {
          throw new Error('identifier must be a string');
        }
        if (identifier.length > IDENTIFIER_MAX_LENGTH) {
          throw new Error(`maximum identifier length is ${IDENTIFIER_MAX_LENGTH}`);
        }
        if (!Buffer.isBuffer(address)) {
          throw new Error('address must be a buffer');
        }
        if (address.length > ADDRESS_MAX_LENGTH) {
          throw new Error(`maximum address length is ${ADDRESS_MAX_LENGTH}`);
        }
        if (!Buffer.isBuffer(item)) {
          throw new Error('item must be a buffer');
        }
        if (item.length > ADDRESS_MAX_LENGTH) {
          throw new Error(`maximum item length is ${ITEM_MAX_LENGTH}`);
        }
        await addCount(stateStore, identifier, address, item);
        return true;
      } catch {
        return false;
      }
    },
  };
}
