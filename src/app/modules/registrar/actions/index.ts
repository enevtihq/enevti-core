import { BlockRegisrarChain, RegistrarChain } from 'enevti-types/chain/registrar';
import { BaseModule } from 'lisk-framework';
import { IDENTIFIER_MAX_LENGTH, VALUE_MAX_LENGTH } from '../constants/limit';
import { accessBlockRegistrar } from '../utils/block';
import { accessRegistrar } from '../utils/registrar';

export function registrarActions(this: BaseModule) {
  return {
    getRegistrar: async (params): Promise<RegistrarChain | undefined> => {
      const { identifier, value } = params as Record<string, string>;
      if (typeof identifier !== 'string') {
        throw new Error('identifier must be a string');
      }
      if (identifier.length > IDENTIFIER_MAX_LENGTH) {
        throw new Error(`maximum identifier length is ${IDENTIFIER_MAX_LENGTH}`);
      }
      if (typeof value !== 'string') {
        throw new Error('value must be a string');
      }
      if (value.length > VALUE_MAX_LENGTH) {
        throw new Error(`maximum value length is ${VALUE_MAX_LENGTH}`);
      }
      const registrar = await accessRegistrar(this._dataAccess, identifier, value);
      return registrar;
    },
    getBlockRegistrar: async (params): Promise<BlockRegisrarChain | undefined> => {
      const { height } = params as Record<string, number>;
      if (typeof height !== 'number') {
        throw new Error('height must be a number');
      }
      const blockRegistrar = await accessBlockRegistrar(this._dataAccess, height);
      return blockRegistrar;
    },
  };
}
