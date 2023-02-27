import { StateStore, BaseModule, ReducerHandler } from 'lisk-framework';
import { CommentItemChain, CommentListChain } from 'enevti-types/chain/comment';
import { getComment } from '../utils/item';
import { getComments } from '../utils/list';
import { addComment, AddCommentPayload } from '../utils/add';
import {
  ADDRESS_MAX_LENGTH,
  CID_MAX_LENGTH,
  IDENTIFIER_MAX_LENGTH,
  ID_MAX_LENGTH,
  KEY_MAX_LENGTH,
  TARGET_MAX_LENGTH,
} from '../constants/limit';

export function commentReducers(this: BaseModule) {
  return {
    getComment: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<CommentItemChain | undefined> => {
      const { id } = params as { id: Buffer };
      if (!Buffer.isBuffer(id)) {
        throw new Error('id must be a buffer');
      }
      if (id.length > ID_MAX_LENGTH) {
        throw new Error(`maximum id length is ${ID_MAX_LENGTH}`);
      }
      const comment = await getComment(stateStore, id);
      return comment;
    },
    getComments: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<CommentListChain | undefined> => {
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
      const comments = await getComments(stateStore, identifier, key);
      return comments;
    },
    addActivity: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<boolean> => {
      try {
        const { reducerHandler, payload } = params as {
          reducerHandler: ReducerHandler;
          payload: AddCommentPayload;
        };
        if (!reducerHandler || reducerHandler.invoke === undefined) {
          throw new Error('reducerHandler is invalid');
        }
        if (typeof payload !== 'object') {
          throw new Error('payload must be an object');
        }
        if (typeof payload.cid !== 'string') {
          throw new Error('payload.cid must be a string');
        }
        if (payload.cid.length > CID_MAX_LENGTH) {
          throw new Error(`maximum payload.cid length is ${CID_MAX_LENGTH}`);
        }
        if (!Buffer.isBuffer(payload.creator)) {
          throw new Error('payload.creator must be a buffer');
        }
        if (payload.creator.length > ADDRESS_MAX_LENGTH) {
          throw new Error(`maximum payload.creator length is ${ADDRESS_MAX_LENGTH}`);
        }
        if (!Buffer.isBuffer(payload.id)) {
          throw new Error('payload.id must be a buffer');
        }
        if (payload.id.length > ID_MAX_LENGTH) {
          throw new Error(`maximum payload.id length is ${ID_MAX_LENGTH}`);
        }
        if (typeof payload.identifier !== 'string') {
          throw new Error('payload.identifier must be a string');
        }
        if (payload.identifier.length > IDENTIFIER_MAX_LENGTH) {
          throw new Error(`maximum payload.identifier length is ${IDENTIFIER_MAX_LENGTH}`);
        }
        if (!Buffer.isBuffer(payload.target)) {
          throw new Error('payload.target must be a buffer');
        }
        if (payload.target.length > TARGET_MAX_LENGTH) {
          throw new Error(`maximum payload.target length is ${TARGET_MAX_LENGTH}`);
        }
        await addComment(stateStore, reducerHandler, payload);
        return true;
      } catch {
        return false;
      }
    },
  };
}
