import { StateStore } from 'lisk-sdk';
import { getCountItem, setCountItem } from './item';
import { getCount, setCount } from './count';

export const addCount = async (
  stateStore: StateStore,
  module: string,
  key: string,
  address: Buffer,
  item: Buffer,
) => {
  const count = (await getCount(stateStore, module, address)) ?? { total: 0 };
  count.total += 1;
  await setCount(stateStore, module, address, count);

  const countItem = (await getCountItem(stateStore, module, key, address)) ?? {
    items: [],
  };
  countItem.items.unshift(item);
  await setCountItem(stateStore, module, key, address, countItem);
};
