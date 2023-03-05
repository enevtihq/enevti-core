import { StateSchemaFromType } from 'enevti-types/utils/schema';
import { ExclusiveCommentListChain } from 'enevti-types/chain/nft_exclusive_comment';
import { EXCLUSIVE_COMMENT_PREFIX } from '../constants/codec';

export const commentListSchema: StateSchemaFromType<ExclusiveCommentListChain> = {
  $id: `enevti/${EXCLUSIVE_COMMENT_PREFIX}/list`,
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
