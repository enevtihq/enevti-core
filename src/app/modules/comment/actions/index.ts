import { CommentItemChain, CommentListChain } from 'enevti-types/chain/comment';
import { GetCommentParam, GetCommentsParam } from 'enevti-types/param/comment';
import { BaseModule } from 'lisk-framework';
import { ID_BYTES_MAX_LENGTH, KEY_STRING_MAX_LENGTH } from 'enevti-types/constant/validation';
import { accessComment } from '../utils/item';
import { accessComments } from '../utils/list';

export function commentActions(this: BaseModule) {
  return {
    getComment: async (params): Promise<CommentItemChain | undefined> => {
      const { id } = params as GetCommentParam;
      if (!Buffer.isBuffer(id)) {
        throw new Error('id must be a buffer');
      }
      if (id.length > ID_BYTES_MAX_LENGTH) {
        throw new Error(`maximum id length is ${ID_BYTES_MAX_LENGTH}`);
      }
      const comment = await accessComment(this._dataAccess, id);
      return comment;
    },
    getComments: async (params): Promise<CommentListChain | undefined> => {
      const { identifier, key } = params as GetCommentsParam;
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
      const comments = await accessComments(this._dataAccess, identifier, key);
      return comments;
    },
  };
}
