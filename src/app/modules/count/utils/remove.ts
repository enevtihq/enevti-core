import { StateStore } from 'lisk-sdk';
import { getCountItem, setCountItem } from './item';
import { getCount, setCount } from './count';

export const removeCount = async (
  stateStore: StateStore,
  module: string,
  key: string,
  address: Buffer,
  item: Buffer,
) => {
  const count = await getCount(stateStore, module, address);
  if (!count) throw new Error('count chain state not found');
  count.total -= 1;

  const countItem = await getCountItem(stateStore, module, key, address);
  if (!countItem) throw new Error('countItem chain state not found');
  const index = countItem.items.findIndex(t => Buffer.compare(t, item) === 0);
  if (index === -1) throw new Error('item not found in countItem array');
  countItem.items.splice(index, 1);

  await setCount(stateStore, module, address, count);
  await setCountItem(stateStore, module, key, address, countItem);
};
