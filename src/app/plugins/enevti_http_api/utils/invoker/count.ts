import { CountChain, CountItemChain } from 'enevti-types/chain/count';
import { GetCountItemParam, GetCountParam } from 'enevti-types/param/count';
import { BaseChannel } from 'lisk-framework';

/**
 * get count total from chain
 *
 * @example <caption>Get count data of 'like' module for address '9cabee3d27426676b852ce6b804cb2fdff7cd0b5':</caption>
 * const address = Buffer.from('9cabee3d27426676b852ce6b804cb2fdff7cd0b5', 'hex');
 * await invokeGetCount(channel, 'like', address);
 *
 * @param channel plugin channel from Lisk SDK
 * @param module module name
 * @param address account hex address in bytes
 * @returns CountChain | undefined
 */
export const invokeGetCount = async (
  channel: BaseChannel,
  module: string,
  address: Buffer,
): Promise<CountChain | undefined> =>
  channel.invoke('count:getCount', { module, address } as GetCountParam);

/**
 * get count item details from chain with specified key
 *
 * @example <caption>Get count data of 'like' module for 'sent' key for address '9cabee3d27426676b852ce6b804cb2fdff7cd0b5':</caption>
 * const address = Buffer.from('9cabee3d27426676b852ce6b804cb2fdff7cd0b5', 'hex');
 * await invokeGetCountItem(channel, 'like', 'sent', address);
 *
 * @param channel plugin channel from Lisk SDK
 * @param module module name
 * @param key identifier for specified count data
 * @param address account hex address in bytes
 * @returns CountItemChain | undefined
 */
export const invokeGetCountItem = async (
  channel: BaseChannel,
  module: string,
  key: string,
  address: Buffer,
): Promise<CountItemChain | undefined> =>
  channel.invoke('count:getCountItem', { module, key, address } as GetCountItemParam);
