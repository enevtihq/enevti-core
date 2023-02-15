import { StateStore, BaseModule } from 'lisk-framework';
import { BlockRegisrarAsset, RegistrarAsset } from 'enevti-types/chain/registrar';
import { getRegistrar, setRegistrar } from '../utils/registrar';
import { getBlockRegistrar, setBlockRegistrar } from '../utils/block';

export function registrarReducers(this: BaseModule) {
  return {
    getRegistrar: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<RegistrarAsset | undefined> => {
      const { identifier, value } = params as Record<string, string>;
      const registrar = await getRegistrar(stateStore, identifier, value);
      return registrar;
    },
    getBlockRegistrar: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<BlockRegisrarAsset | undefined> => {
      const { height } = params as Record<string, number>;
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
