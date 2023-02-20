import { CountItemChain } from 'enevti-types/chain/count';
import { BaseModuleDataAccess, codec, StateStore } from 'lisk-sdk';
import { COUNT_ITEM_PREFIX, COUNT_PREFIX } from '../constants/codec';
import { countItemSchema } from '../schema/item';

export const accessCountItem = async (
  dataAccess: BaseModuleDataAccess,
  identifier: string,
  address: Buffer,
): Promise<CountItemChain | undefined> => {
  const countItemBuffer = await dataAccess.getChainState(
    `${COUNT_PREFIX}:${identifier}:${address.toString('hex')}:${COUNT_ITEM_PREFIX}`,
  );
  if (!countItemBuffer) {
    return undefined;
  }
  return codec.decode<CountItemChain>(countItemSchema, countItemBuffer);
};

export const getCountItem = async (
  stateStore: StateStore,
  identifier: string,
  address: Buffer,
): Promise<CountItemChain | undefined> => {
  const countItemBuffer = await stateStore.chain.get(
    `${COUNT_PREFIX}:${identifier}:${address.toString('hex')}:${COUNT_ITEM_PREFIX}`,
  );
  if (!countItemBuffer) {
    return undefined;
  }
  return codec.decode<CountItemChain>(countItemSchema, countItemBuffer);
};

export const setCountItem = async (
  stateStore: StateStore,
  identifier: string,
  address: Buffer,
  countItem: CountItemChain,
) => {
  await stateStore.chain.set(
    `${COUNT_PREFIX}:${identifier}:${address.toString('hex')}:${COUNT_ITEM_PREFIX}`,
    codec.encode(countItemSchema, countItem),
  );
};
