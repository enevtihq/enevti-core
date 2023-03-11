import { StateStore, BaseModule } from 'lisk-framework';
import { CommentItemChain, CommentListChain } from 'enevti-types/chain/comment';
import { AddCommentParam, GetCommentParam, GetCommentsParam } from 'enevti-types/param/comment';
import {
  ADDRESS_BYTES_MAX_LENGTH,
  CID_STRING_MAX_LENGTH,
  ID_BYTES_MAX_LENGTH,
  KEY_STRING_MAX_LENGTH,
} from 'enevti-types/constant/validation';
import { getComment } from '../utils/item';
import { getComments } from '../utils/list';
import { addComment } from '../utils/add';

export function commentReducers(this: BaseModule) {
  return {
    getComment: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<CommentItemChain | undefined> => {
      const { id } = params as GetCommentParam;
      if (!Buffer.isBuffer(id)) {
        throw new Error('id must be a buffer');
      }
      if (id.length > ID_BYTES_MAX_LENGTH) {
        throw new Error(`maximum id length is ${ID_BYTES_MAX_LENGTH}`);
      }
      const comment = await getComment(stateStore, id);
      return comment;
    },
    getComments: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<CommentListChain | undefined> => {
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
      const comments = await getComments(stateStore, identifier, key);
      return comments;
    },
    addComment: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<boolean> => {
      try {
        const { reducerHandler, payload } = params as AddCommentParam;
        if (!reducerHandler || reducerHandler.invoke === undefined) {
          throw new Error('reducerHandler is invalid');
        }
        if (typeof payload !== 'object') {
          throw new Error('payload must be an object');
        }
        if (typeof payload.cid !== 'string') {
          throw new Error('payload.cid must be a string');
        }
        if (payload.cid.length > CID_STRING_MAX_LENGTH) {
          throw new Error(`maximum payload.cid length is ${CID_STRING_MAX_LENGTH}`);
        }
        if (!Buffer.isBuffer(payload.creator)) {
          throw new Error('payload.creator must be a buffer');
        }
        if (payload.creator.length > ADDRESS_BYTES_MAX_LENGTH) {
          throw new Error(`maximum payload.creator length is ${ADDRESS_BYTES_MAX_LENGTH}`);
        }
        if (!Buffer.isBuffer(payload.id)) {
          throw new Error('payload.id must be a buffer');
        }
        if (payload.id.length > ID_BYTES_MAX_LENGTH) {
          throw new Error(`maximum payload.id length is ${ID_BYTES_MAX_LENGTH}`);
        }
        if (typeof payload.identifier !== 'string') {
          throw new Error('payload.identifier must be a string');
        }
        if (payload.identifier.length > KEY_STRING_MAX_LENGTH) {
          throw new Error(`maximum payload.identifier length is ${KEY_STRING_MAX_LENGTH}`);
        }
        if (!Buffer.isBuffer(payload.target)) {
          throw new Error('payload.target must be a buffer');
        }
        if (payload.target.length > ID_BYTES_MAX_LENGTH) {
          throw new Error(`maximum payload.target length is ${ID_BYTES_MAX_LENGTH}`);
        }
        await addComment(stateStore, reducerHandler, payload);
        return true;
      } catch {
        return false;
      }
    },
  };
}
