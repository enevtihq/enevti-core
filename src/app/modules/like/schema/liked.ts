import { LikedChain } from 'enevti-types/chain/like';
import { StateSchemaFromType } from 'enevti-types/utils/schema';
import { LIKED_PREFIX, LIKE_MODULE_PREFIX } from '../constants/codec';

export const likedSchema: StateSchemaFromType<LikedChain> = {
  $id: `enevti/${LIKE_MODULE_PREFIX}/${LIKED_PREFIX}`,
  type: 'object',
  required: ['status'],
  properties: {
    status: {
      dataType: 'uint32',
      fieldNumber: 1,
    },
  },
};
