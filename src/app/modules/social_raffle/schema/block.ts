import { SocialRaffleBlockRecord } from 'enevti-types/chain/social_raffle';
import { ArraySchema, BaseSchemaFromType, StateSchemaFromType } from 'enevti-types/utils/schema';
import { BLOCK_RECORD_PREFIX, SOCIAL_RAFFLE_PREFIX } from '../constants/codec';

export const raffleBlockRecordSchema: StateSchemaFromType<
  SocialRaffleBlockRecord,
  { items: ArraySchema<BaseSchemaFromType<SocialRaffleBlockRecord['items'][0]>> }
> = {
  $id: `enevti/${SOCIAL_RAFFLE_PREFIX}/${BLOCK_RECORD_PREFIX}`,
  type: 'object',
  required: ['items'],
  properties: {
    items: {
      type: 'array',
      fieldNumber: 1,
      items: {
        type: 'object',
        required: ['id', 'winner', 'raffled'],
        properties: {
          id: {
            dataType: 'bytes',
            fieldNumber: 1,
          },
          winner: {
            dataType: 'bytes',
            fieldNumber: 2,
          },
          raffled: {
            type: 'array',
            fieldNumber: 3,
            items: {
              dataType: 'bytes',
            },
          },
        },
      },
    },
  },
};
