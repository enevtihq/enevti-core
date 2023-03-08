import {
  ActivityGenesisChain,
  ActivityItemChain,
  ActivityListChain,
} from 'enevti-types/chain/activity';
import {
  GetActivitiesParam,
  GetActivityGenesisParam,
  GetActivityParam,
} from 'enevti-types/param/activity';
import { BaseChannel } from 'lisk-framework';

/**
 * get activity details from specified ID
 *
 * @example <caption>Get activity with id '9cabee3d27426676b852ce6b804cb2fdff7cd0b5':</caption>
 * const activityId = Buffer.from('9cabee3d27426676b852ce6b804cb2fdff7cd0b5', 'hex');
 * await invokeGetActivity(channel, activityId);
 *
 * @param channel plugin channel from Lisk SDK
 * @param id activity id bytes
 * @returns ActivityItemChain | undefined
 */
export const invokeGetActivity = async (
  channel: BaseChannel,
  id: Buffer,
): Promise<ActivityItemChain | undefined> =>
  channel.invoke('activity:getActivity', { id } as GetActivityParam);

/**
 * get list of activities for defined identifier and key, from activity module
 *
 * @example <caption>Get activity from 'profile' with address '9cabee3d27426676b852ce6b804cb2fdff7cd0b5':</caption>
 * await invokeGetActivities(channel, 'profile', '9cabee3d27426676b852ce6b804cb2fdff7cd0b5');
 *
 * @param channel plugin channel from Lisk SDK
 * @param identifier activity chain identifier, mostly object name
 * @param key key for defined identifier, mostly unique id of the object
 * @returns ActivityListChain | undefined
 */
export const invokeGetActivities = async (
  channel: BaseChannel,
  identifier: string,
  key: string,
): Promise<ActivityListChain | undefined> =>
  channel.invoke('activity:getActivities', { identifier, key } as GetActivitiesParam);

/**
 * get initial state for defined identifier and key, from activity module
 *
 * @example <caption>Get initial state from 'profile' with address '9cabee3d27426676b852ce6b804cb2fdff7cd0b5':</caption>
 * await invokeGetActivities(channel, 'profile', '9cabee3d27426676b852ce6b804cb2fdff7cd0b5');
 *
 * @param channel plugin channel from Lisk SDK
 * @param identifier activity chain identifier, mostly object name
 * @param key key for defined identifier, mostly unique id of the object
 * @returns ActivityListChain | undefined
 */
export const invokeGetActivityGenesis = async (
  channel: BaseChannel,
  identifier: string,
  key: string,
): Promise<ActivityGenesisChain | undefined> =>
  channel.invoke('activity:getActivityGenesis', { identifier, key } as GetActivityGenesisParam);
