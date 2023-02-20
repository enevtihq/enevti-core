import { StateSchemaFromType, ArraySchema } from 'enevti-types/utils/schema';
import { LikeChain } from 'enevti-types/chain/like';
import { LIKE_MODULE_PREFIX, LIKE_PREFIX } from '../constants/codec';

export const likeSchema: StateSchemaFromType<
  LikeChain,
  { address: ArraySchema<Record<'dataType', string>> }
> = {
  $id: `enevti/${LIKE_MODULE_PREFIX}/${LIKE_PREFIX}`,
  type: 'object',
  required: ['address'],
  properties: {
    address: {
      type: 'array',
      fieldNumber: 1,
      items: {
        dataType: 'bytes',
      },
    },
  },
};
