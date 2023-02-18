import { StateStore, BaseModule } from 'lisk-framework';
import { BlockRegisrarChain, RegistrarChain } from 'enevti-types/chain/registrar';
import { getRegistrar, setRegistrar } from '../utils/registrar';
import { getBlockRegistrar, setBlockRegistrar } from '../utils/block';

export function registrarReducers(this: BaseModule) {
  return {
    getRegistrar: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<RegistrarChain | undefined> => {
      const { identifier, value } = params as Record<string, string>;
      if (typeof identifier !== 'string') {
        throw new Error('identifier must be a string');
      }
      if (typeof value !== 'string') {
        throw new Error('value must be a string');
      }
      const registrar = await getRegistrar(stateStore, identifier, value);
      return registrar;
    },
    getBlockRegistrar: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<BlockRegisrarChain | undefined> => {
      const { height } = params as Record<string, number>;
      if (typeof height !== 'number') {
        throw new Error('height must be a number');
      }
      const blockRegistrar = await getBlockRegistrar(stateStore, height);
      return blockRegistrar;
    },
    setRegistrar: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<boolean> => {
      try {
        const { identifier, value, id } = params as {
          identifier: string;
          value: string;
          id: Buffer;
        };
        if (typeof identifier !== 'string') {
          throw new Error('identifier must be a string');
        }
        if (typeof value !== 'string') {
          throw new Error('value must be a string');
        }
        if (!Buffer.isBuffer(id)) {
          throw new Error('id must be a buffer');
        }
        await setRegistrar(stateStore, identifier, value, { id });
        const blockHeight = stateStore.chain.lastBlockHeaders[0].height + 1;
        let blockRegistrar = await getBlockRegistrar(stateStore, blockHeight);
        if (!blockRegistrar) {
          blockRegistrar = { items: [] };
        }
        blockRegistrar.items.unshift({ name: identifier, payload: value });
        await setBlockRegistrar(stateStore, blockHeight, blockRegistrar);
        return true;
      } catch {
        return false;
      }
    },
  };
}
