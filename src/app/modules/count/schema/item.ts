import { StateSchemaFromType, ArraySchema } from 'enevti-types/utils/schema';
import { CountItemChain } from 'enevti-types/chain/count';
import { COUNT_ITEM_PREFIX, COUNT_PREFIX } from '../constants/codec';

export const countItemSchema: StateSchemaFromType<
  CountItemChain,
  Record<keyof CountItemChain, ArraySchema<Record<'dataType', string>>>
> = {
  $id: `enevti/${COUNT_PREFIX}/${COUNT_ITEM_PREFIX}`,
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
