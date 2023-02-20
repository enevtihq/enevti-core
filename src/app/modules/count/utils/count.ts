import { CountChain } from 'enevti-types/chain/count';
import { BaseModuleDataAccess, codec, StateStore } from 'lisk-sdk';
import { COUNT_PREFIX } from '../constants/codec';
import { countSchema } from '../schema/count';

export const accessCount = async (
  dataAccess: BaseModuleDataAccess,
  module: string,
  address: Buffer,
): Promise<CountChain | undefined> => {
  const countBuffer = await dataAccess.getChainState(
    `${COUNT_PREFIX}:${module}:${address.toString('hex')}`,
  );
  if (!countBuffer) {
    return undefined;
  }
  return codec.decode<CountChain>(countSchema, countBuffer);
};

export const getCount = async (
  stateStore: StateStore,
  module: string,
  address: Buffer,
): Promise<CountChain | undefined> => {
  const countBuffer = await stateStore.chain.get(
    `${COUNT_PREFIX}:${module}:${address.toString('hex')}`,
  );
  if (!countBuffer) {
    return undefined;
  }
  return codec.decode<CountChain>(countSchema, countBuffer);
};

export const setCount = async (
  stateStore: StateStore,
  module: string,
  address: Buffer,
  count: CountChain,
) => {
  await stateStore.chain.set(
    `${COUNT_PREFIX}:${module}:${address.toString('hex')}`,
    codec.encode(countSchema, count),
  );
};
