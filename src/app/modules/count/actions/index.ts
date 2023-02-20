import { CountChain, CountItemChain } from 'enevti-types/chain/count';
import { BaseModule } from 'lisk-framework';
import { ADDRESS_MAX_LENGTH, IDENTIFIER_MAX_LENGTH } from '../constants/limit';
import { accessCount } from '../utils/count';
import { accessCountItem } from '../utils/item';

export function countActions(this: BaseModule) {
  return {
    getCount: async (params): Promise<CountChain | undefined> => {
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
      const count = await accessCount(this._dataAccess, identifier, address);
      return count;
    },
    getCountItem: async (params): Promise<CountItemChain | undefined> => {
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
      const countItem = await accessCountItem(this._dataAccess, identifier, address);
      return countItem;
    },
  };
}
