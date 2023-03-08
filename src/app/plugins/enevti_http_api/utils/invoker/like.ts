import { LikeChain, LikedChain } from 'enevti-types/chain/like';
import { GetLikedParam, GetLikeParam } from 'enevti-types/param/like';
import { ModuleInfo } from 'enevti-types/utils/moduleInfo';
import { BaseChannel } from 'lisk-framework';
import { ADD_LIKE_ASSET_NAME } from '../../../../modules/like/constants/codec';

/**
 * get like module info
 *
 * @param channel plugin channel from Lisk SDK
 * @returns ModuleInfo
 */
export const invokeLikeGetInfo = async (
  channel: BaseChannel,
): Promise<ModuleInfo<typeof ADD_LIKE_ASSET_NAME>> => channel.invoke('like:getInfo');

/**
 * get like state from specified identifier and target
 *
 * @example <caption>Get like state of 'collection' with collectionId '9cabee3d27426676b852ce6b804cb2fdff7cd0b5':</caption>
 * await invokeGetLike(channel, 'collection', '9cabee3d27426676b852ce6b804cb2fdff7cd0b5');
 *
 * @param channel plugin channel from Lisk SDK
 * @param identifier like chain identifier, mostly module name
 * @param target target identifier inside like chain, mostly unique id of an object
 * @returns LikeChain | undefined
 */
export const invokeGetLike = async (
  channel: BaseChannel,
  identifier: string,
  target: string,
): Promise<LikeChain | undefined> =>
  channel.invoke('like:getLike', { identifier, target } as GetLikeParam);

/**
 * get whether the target is already liked by address
 *
 * @example <caption>Get whether object with id '9cabee3d27426676b852ce6b804cb2fdff7cd0b5' has been liked by '6fc317c3383af7c75aa29916b4f443b3ca86ee28':</caption>
 * const address = Buffer.from('6fc317c3383af7c75aa29916b4f443b3ca86ee28', 'hex');
 * await invokeGetLiked(channel, '9cabee3d27426676b852ce6b804cb2fdff7cd0b5', address);
 *
 * @param channel plugin channel from Lisk SDK
 * @param target target identifier inside like chain, mostly unique id of an object
 * @param address account hex address in bytes
 * @returns LikedChain | undefined
 */
export const invokeGetLiked = async (
  channel: BaseChannel,
  target: string,
  address: Buffer,
): Promise<LikedChain | undefined> =>
  channel.invoke('like:getLiked', { target, address } as GetLikedParam);
