import { StateSchemaFromType } from 'enevti-types/utils/schema';
import { CountChain } from 'enevti-types/chain/count';
import { COUNT_ITEM_PREFIX, COUNT_PREFIX } from '../constants/codec';

export const countSchema: StateSchemaFromType<CountChain> = {
  $id: `enevti/${COUNT_PREFIX}/${COUNT_ITEM_PREFIX}`,
  type: 'object',
  required: ['total'],
  properties: {
    total: {
      dataType: 'uint32',
      fieldNumber: 1,
    },
  },
};
