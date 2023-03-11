import { BlockRegisrarChain, RegistrarChain } from 'enevti-types/chain/registrar';
import { KEY_STRING_MAX_LENGTH } from 'enevti-types/constant/validation';
import { GetBlockRegistrarParam, GetRegistrarParam } from 'enevti-types/param/registrar';
import { BaseModule } from 'lisk-framework';
import { accessBlockRegistrar } from '../utils/block';
import { accessRegistrar } from '../utils/registrar';

export function registrarActions(this: BaseModule) {
  return {
    getRegistrar: async (params): Promise<RegistrarChain | undefined> => {
      const { identifier, value } = params as GetRegistrarParam;
      if (typeof identifier !== 'string') {
        throw new Error('identifier must be a string');
      }
      if (identifier.length > KEY_STRING_MAX_LENGTH) {
        throw new Error(`maximum identifier length is ${KEY_STRING_MAX_LENGTH}`);
      }
      if (typeof value !== 'string') {
        throw new Error('value must be a string');
      }
      if (value.length > KEY_STRING_MAX_LENGTH) {
        throw new Error(`maximum value length is ${KEY_STRING_MAX_LENGTH}`);
      }
      const registrar = await accessRegistrar(this._dataAccess, identifier, value);
      return registrar;
    },
    getBlockRegistrar: async (params): Promise<BlockRegisrarChain | undefined> => {
      const { height } = params as GetBlockRegistrarParam;
      if (typeof height !== 'number') {
        throw new Error('height must be a number');
      }
      const blockRegistrar = await accessBlockRegistrar(this._dataAccess, height);
      return blockRegistrar;
    },
  };
}
