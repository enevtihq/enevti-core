import { StateSchemaFromType } from 'enevti-types/utils/schema';
import { CommentListChain } from 'enevti-types/chain/comment';
import { COMMENT_PREFIX } from '../constants/codec';

export const commentListSchema: StateSchemaFromType<CommentListChain> = {
  $id: `enevti/${COMMENT_PREFIX}/list`,
  type: 'object',
  required: ['items'],
  properties: {
    items: {
      type: 'array',
      fieldNumber: 1,
      items: {
        dataType: 'bytes',
      },
    },
  },
};
