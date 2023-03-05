import { ExclusiveCommentItemChain } from 'enevti-types/chain/nft_exclusive_comment';
import { StateSchemaFromType } from 'enevti-types/utils/schema';
import { EXCLUSIVE_COMMENT_PREFIX } from '../constants/codec';

export const commentItemSchema: StateSchemaFromType<ExclusiveCommentItemChain> = {
  $id: `enevti/${EXCLUSIVE_COMMENT_PREFIX}/item`,
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
