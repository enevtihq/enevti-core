import { CommentItemChain, CommentListChain } from 'enevti-types/chain/comment';
import { GetCommentParam, GetCommentsParam } from 'enevti-types/param/comment';
import { BaseChannel } from 'lisk-framework';

/**
 * get comment details from specified ID
 *
 * @example <caption>Get comment with id '9cabee3d27426676b852ce6b804cb2fdff7cd0b5':</caption>
 * const commentId = Buffer.from('9cabee3d27426676b852ce6b804cb2fdff7cd0b5', 'hex');
 * await invokeGetComment(channel, commentId);
 *
 * @param channel plugin channel from Lisk SDK
 * @param id comment id bytes
 * @returns CommentItemChain | undefined
 */
export const invokeGetComment = async (
  channel: BaseChannel,
  id: Buffer,
): Promise<CommentItemChain | undefined> =>
  channel.invoke('comment:getComment', { id } as GetCommentParam);

/**
 * get comment list for defined identifier and key, from comment module
 *
 * @example <caption>Get comment from 'profile' with address '9cabee3d27426676b852ce6b804cb2fdff7cd0b5':</caption>
 * await invokeGetComments(channel, 'profile', '9cabee3d27426676b852ce6b804cb2fdff7cd0b5');
 *
 * @param channel plugin channel from Lisk SDK
 * @param identifier comment chain identifier, mostly object name
 * @param key key for defined identifier, mostly unique id of the object
 * @returns CommentListChain | undefined
 */
export const invokeGetComments = async (
  channel: BaseChannel,
  identifier: string,
  key: string,
): Promise<CommentListChain | undefined> =>
  channel.invoke('comment:getComments', { identifier, key } as GetCommentsParam);
