import {
  ExclusiveCommentItemChain,
  ExclusiveCommentListChain,
  ExclusiveReplyItemChain,
  ExclusiveReplyListChain,
} from 'enevti-types/chain/nft_exclusive_comment';
import { ID_BYTES_MAX_LENGTH, KEY_STRING_MAX_LENGTH } from 'enevti-types/constant/validation';
import {
  GetExclusiveCommentParam,
  GetExclusiveCommentsParam,
  GetExclusiveRepliesParam,
  GetExclusiveReplyParam,
} from 'enevti-types/param/nft_exclusive_comment';
import { BaseModule } from 'lisk-framework';
import { accessExclusiveComment } from '../utils/commentItem';
import { accessExclusiveComments } from '../utils/commentList';
import { accessExclusiveReply } from '../utils/replyItem';
import { accessExclusiveReplies } from '../utils/replyList';

export function exclusiveCommentActions(this: BaseModule) {
  return {
    getExclusiveComment: async (params): Promise<ExclusiveCommentItemChain | undefined> => {
      const { id } = params as GetExclusiveCommentParam;
      if (!Buffer.isBuffer(id)) {
        throw new Error('id must be a buffer');
      }
      if (id.length > ID_BYTES_MAX_LENGTH) {
        throw new Error(`maximum id length is ${ID_BYTES_MAX_LENGTH}`);
      }
      const comment = await accessExclusiveComment(this._dataAccess, id);
      return comment;
    },
    getExclusiveComments: async (params): Promise<ExclusiveCommentListChain | undefined> => {
      const { identifier, key } = params as GetExclusiveCommentsParam;
      if (typeof identifier !== 'string') {
        throw new Error('identifier must be a string');
      }
      if (identifier.length > KEY_STRING_MAX_LENGTH) {
        throw new Error(`maximum identifier length is ${KEY_STRING_MAX_LENGTH}`);
      }
      if (typeof key !== 'string') {
        throw new Error('key must be a string');
      }
      if (key.length > KEY_STRING_MAX_LENGTH) {
        throw new Error(`maximum key length is ${KEY_STRING_MAX_LENGTH}`);
      }
      const comments = await accessExclusiveComments(this._dataAccess, identifier, key);
      return comments;
    },
    getExclusiveReply: async (params): Promise<ExclusiveReplyItemChain | undefined> => {
      const { id } = params as GetExclusiveReplyParam;
      if (!Buffer.isBuffer(id)) {
        throw new Error('id must be a buffer');
      }
      if (id.length > ID_BYTES_MAX_LENGTH) {
        throw new Error(`maximum id length is ${ID_BYTES_MAX_LENGTH}`);
      }
      const reply = await accessExclusiveReply(this._dataAccess, id);
      return reply;
    },
    getExclusiveReplies: async (params): Promise<ExclusiveReplyListChain | undefined> => {
      const { id } = params as GetExclusiveRepliesParam;
      if (!Buffer.isBuffer(id)) {
        throw new Error('id must be a buffer');
      }
      if (id.length > ID_BYTES_MAX_LENGTH) {
        throw new Error(`maximum id length is ${ID_BYTES_MAX_LENGTH}`);
      }
      const replies = await accessExclusiveReplies(this._dataAccess, id);
      return replies;
    },
  };
}
