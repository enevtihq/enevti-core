import { CommentItemChain } from 'enevti-types/chain/comment';
import { StateSchemaFromType } from 'enevti-types/utils/schema';
import { COMMENT_PREFIX } from '../constants/codec';

export const commentItemSchema: StateSchemaFromType<CommentItemChain> = {
  $id: `enevti/${COMMENT_PREFIX}/item`,
  type: 'object',
  required: ['date', 'creator', 'cid', 'target'],
  properties: {
    date: {
      dataType: 'uint64',
      fieldNumber: 1,
    },
    creator: {
      dataType: 'bytes',
      fieldNumber: 2,
    },
    cid: {
      dataType: 'string',
      fieldNumber: 3,
    },
    target: {
      dataType: 'bytes',
      fieldNumber: 4,
    },
  },
};
