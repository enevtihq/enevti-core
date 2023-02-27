import { CommentItemChain, CommentListChain } from 'enevti-types/chain/comment';
import { BaseModule } from 'lisk-framework';
import { ID_MAX_LENGTH, IDENTIFIER_MAX_LENGTH, KEY_MAX_LENGTH } from '../constants/limit';
import { accessComment } from '../utils/item';
import { accessComments } from '../utils/list';

export function commentActions(this: BaseModule) {
  return {
    getComment: async (params): Promise<CommentItemChain | undefined> => {
      const { id } = params as { id: Buffer };
      if (!Buffer.isBuffer(id)) {
        throw new Error('id must be a buffer');
      }
      if (id.length > ID_MAX_LENGTH) {
        throw new Error(`maximum id length is ${ID_MAX_LENGTH}`);
      }
      const comment = await accessComment(this._dataAccess, id);
      return comment;
    },
    getComments: async (params): Promise<CommentListChain | undefined> => {
      const { identifier, key } = params as Record<string, string>;
      if (typeof identifier !== 'string') {
        throw new Error('identifier must be a string');
      }
      if (identifier.length > IDENTIFIER_MAX_LENGTH) {
        throw new Error(`maximum identifier length is ${IDENTIFIER_MAX_LENGTH}`);
      }
      if (typeof key !== 'string') {
        throw new Error('key must be a string');
      }
      if (key.length > KEY_MAX_LENGTH) {
        throw new Error(`maximum key length is ${KEY_MAX_LENGTH}`);
      }
      const comments = await accessComments(this._dataAccess, identifier, key);
      return comments;
    },
  };
}
