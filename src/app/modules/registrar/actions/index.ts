import { BlockRegisrarChain, RegistrarChain } from 'enevti-types/chain/registrar';
import { BaseModule } from 'lisk-framework';
import { accessBlockRegistrar } from '../utils/block';
import { accessRegistrar } from '../utils/registrar';

export function registrarActions(this: BaseModule) {
  return {
    getRegistrar: async (params): Promise<RegistrarChain | undefined> => {
      const { identifier, value } = params as Record<string, string>;
      const registrar = await accessRegistrar(this._dataAccess, identifier, value);
      return registrar;
    },
    getBlockRegistrar: async (params): Promise<BlockRegisrarChain | undefined> => {
      const { height } = params as Record<string, number>;
      const blockRegistrar = await accessBlockRegistrar(this._dataAccess, height);
      return blockRegistrar;
    },
  };
}
