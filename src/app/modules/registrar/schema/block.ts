import { StateSchemaFromType, BaseSchemaFromType, ArraySchema } from 'enevti-types/utils/schema';
import { BlockRegisrarChain } from 'enevti-types/chain/registrar';
import { REGISTRAR_PREFIX } from '../constants/codec';

export const blockRegistrarSchema: StateSchemaFromType<
  BlockRegisrarChain,
  { items: ArraySchema<BaseSchemaFromType<BlockRegisrarChain['items'][0]>> }
> = {
  $id: `enevti/${REGISTRAR_PREFIX}/block`,
  type: 'object',
  required: ['items'],
  properties: {
    items: {
      type: 'array',
      fieldNumber: 1,
      items: {
        type: 'object',
        required: ['name', 'payload'],
        properties: {
          name: {
            dataType: 'string',
            fieldNumber: 1,
          },
          payload: {
            dataType: 'string',
            fieldNumber: 2,
          },
        },
      },
    },
  },
};