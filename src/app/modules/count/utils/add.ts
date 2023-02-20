import { StateStore } from 'lisk-sdk';
import { getCountItem, setCountItem } from './item';
import { getCount, setCount } from './count';

export const addCount = async (
  stateStore: StateStore,
  identifier: string,
  address: Buffer,
  item: Buffer,
) => {
  const count = (await getCount(stateStore, identifier, address)) ?? { total: 0 };
  count.total += 1;
  await setCount(stateStore, identifier, address, count);

  const countItem = (await getCountItem(stateStore, identifier, address)) ?? {
    items: [],
  };
  countItem.items.unshift(item);
  await setCountItem(stateStore, identifier, address, countItem);
};
