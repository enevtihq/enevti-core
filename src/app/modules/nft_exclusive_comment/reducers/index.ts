import { StateStore, BaseModule } from 'lisk-framework';
import {
  ExclusiveCommentItemChain,
  ExclusiveCommentListChain,
  ExclusiveReplyItemChain,
  ExclusiveReplyListChain,
} from 'enevti-types/chain/nft_exclusive_comment';
import {
  AddExclusiveCommentParam,
  AddExclusiveReplyParam,
  GetExclusiveCommentParam,
  GetExclusiveCommentsParam,
  GetExclusiveRepliesParam,
  GetExclusiveReplyParam,
} from 'enevti-types/param/nft_exclusive_comment';
import { getExclusiveComment } from '../utils/commentItem';
import { getExclusiveComments } from '../utils/commentList';
import { addExclusiveComment } from '../utils/addExclusiveComment';
import {
  ADDRESS_MAX_LENGTH,
  CID_MAX_LENGTH,
  IDENTIFIER_MAX_LENGTH,
  ID_MAX_LENGTH,
  KEY_MAX_LENGTH,
  TARGET_MAX_LENGTH,
} from '../constants/limit';
import { getExclusiveReply } from '../utils/replyItem';
import { getExclusiveReplies } from '../utils/replyList';
import { addExclusiveReply } from '../utils/addExclusiveReply';

export function exclusiveCommentReducers(this: BaseModule) {
  return {
    getExclusiveComment: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<ExclusiveCommentItemChain | undefined> => {
      const { id } = params as GetExclusiveCommentParam;
      if (!Buffer.isBuffer(id)) {
        throw new Error('id must be a buffer');
      }
      if (id.length > ID_MAX_LENGTH) {
        throw new Error(`maximum id length is ${ID_MAX_LENGTH}`);
      }
      const comment = await getExclusiveComment(stateStore, id);
      return comment;
    },
    getExclusiveComments: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<ExclusiveCommentListChain | undefined> => {
      const { identifier, key } = params as GetExclusiveCommentsParam;
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
      const comments = await getExclusiveComments(stateStore, identifier, key);
      return comments;
    },
    getExclusiveReply: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<ExclusiveReplyItemChain | undefined> => {
      const { id } = params as GetExclusiveReplyParam;
      if (!Buffer.isBuffer(id)) {
        throw new Error('id must be a buffer');
      }
      if (id.length > ID_MAX_LENGTH) {
        throw new Error(`maximum id length is ${ID_MAX_LENGTH}`);
      }
      const comment = await getExclusiveReply(stateStore, id);
      return comment;
    },
    getExclusiveReplies: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<ExclusiveReplyListChain | undefined> => {
      const { id } = params as GetExclusiveRepliesParam;
      if (!Buffer.isBuffer(id)) {
        throw new Error('id must be a buffer');
      }
      if (id.length > ID_MAX_LENGTH) {
        throw new Error(`maximum id length is ${ID_MAX_LENGTH}`);
      }
      const replies = await getExclusiveReplies(stateStore, id);
      return replies;
    },
    addExclusiveComment: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<boolean> => {
      try {
        const { reducerHandler, payload } = params as AddExclusiveCommentParam;
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
        await addExclusiveComment(stateStore, reducerHandler, payload);
        return true;
      } catch {
        return false;
      }
    },
    addExclusiveReply: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<boolean> => {
      try {
        const { reducerHandler, payload } = params as AddExclusiveReplyParam;
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
        await addExclusiveReply(stateStore, reducerHandler, payload);
        return true;
      } catch {
        return false;
      }
    },
  };
}
