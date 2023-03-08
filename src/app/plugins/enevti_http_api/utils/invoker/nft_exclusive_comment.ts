import {
  ExclusiveCommentItemChain,
  ExclusiveCommentListChain,
  ExclusiveReplyItemChain,
  ExclusiveReplyListChain,
} from 'enevti-types/chain/nft_exclusive_comment';
import {
  GetExclusiveCommentParam,
  GetExclusiveCommentsParam,
  GetExclusiveRepliesParam,
  GetExclusiveReplyParam,
} from 'enevti-types/param/nft_exclusive_comment';
import { BaseChannel } from 'lisk-framework';

/**
 * get exclusive comment details from specified ID
 *
 * @example <caption>Get exclusive comment with id '9cabee3d27426676b852ce6b804cb2fdff7cd0b5':</caption>
 * const commentId = Buffer.from('9cabee3d27426676b852ce6b804cb2fdff7cd0b5', 'hex');
 * await invokeGetExclusiveComment(channel, commentId);
 *
 * @param channel plugin channel from Lisk SDK
 * @param id exclusive comment id bytes
 * @returns ExclusiveCommentItemChain | undefined
 */
export const invokeGetExclusiveComment = async (
  channel: BaseChannel,
  id: Buffer,
): Promise<ExclusiveCommentItemChain | undefined> =>
  channel.invoke('nftExclusiveComment:getExclusiveComment', { id } as GetExclusiveCommentParam);

/**
 * get exclusive comment list for defined identifier and key, from comment module
 *
 * @example <caption>Get exclusive comment from 'profile' with address '9cabee3d27426676b852ce6b804cb2fdff7cd0b5':</caption>
 * await invokeGetExclusiveComments(channel, 'profile', '9cabee3d27426676b852ce6b804cb2fdff7cd0b5');
 *
 * @param channel plugin channel from Lisk SDK
 * @param identifier exclusive comment chain identifier, mostly object name, must be compliant with LIP-52
 * @param key key for defined identifier, mostly unique id of the object
 * @returns ExclusiveCommentListChain | undefined
 */
export const invokeGetExclusiveComments = async (
  channel: BaseChannel,
  identifier: string,
  key: string,
): Promise<ExclusiveCommentListChain | undefined> =>
  channel.invoke('nftExclusiveComment:getExclusiveComments', {
    identifier,
    key,
  } as GetExclusiveCommentsParam);

/**
 * get reply details from specified ID
 *
 * @example <caption>Get reply details with id '9cabee3d27426676b852ce6b804cb2fdff7cd0b5':</caption>
 * const replyId = Buffer.from('9cabee3d27426676b852ce6b804cb2fdff7cd0b5', 'hex');
 * await invokeGetExclusiveReply(channel, replyId);
 *
 * @param channel plugin channel from Lisk SDK
 * @param id reply id bytes
 * @returns ExclusiveReplyItemChain | undefined
 */
export const invokeGetExclusiveReply = async (
  channel: BaseChannel,
  id: Buffer,
): Promise<ExclusiveReplyItemChain | undefined> =>
  channel.invoke('nftExclusiveComment:getExclusiveReply', {
    id,
  } as GetExclusiveReplyParam);

/**
 * get reply list of a exclusive comment
 *
 * @example <caption>Get reply list from exclusive comment with commentId '9cabee3d27426676b852ce6b804cb2fdff7cd0b5':</caption>
 * const commentId = Buffer.from('9cabee3d27426676b852ce6b804cb2fdff7cd0b5', 'hex');
 * await invokegetExclusiveReplies(channel, 'profile', '9cabee3d27426676b852ce6b804cb2fdff7cd0b5');
 *
 * @param channel plugin channel from Lisk SDK
 * @param id exclusive comment id bytes
 * @returns ExclusiveReplyListChain | undefined
 */
export const invokegetExclusiveReplies = async (
  channel: BaseChannel,
  id: Buffer,
): Promise<ExclusiveReplyListChain | undefined> =>
  channel.invoke('nftExclusiveComment:getExclusiveReplies', {
    id,
  } as GetExclusiveRepliesParam);
