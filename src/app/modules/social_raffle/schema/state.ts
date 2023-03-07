import { SocialRaffleChain, SocialRaffleRegistrarItem } from 'enevti-types/chain/social_raffle';
import { StateSchemaFromType, BaseSchemaFromType, ArraySchema } from 'enevti-types/utils/schema';
import { RAFFLE_STATE_PREFIX, SOCIAL_RAFFLE_PREFIX } from '../constants/codec';

export const raffleStateSchema: StateSchemaFromType<
  SocialRaffleChain,
  Record<
    'registrar',
    BaseSchemaFromType<
      SocialRaffleRegistrarItem,
      Record<'candidate', ArraySchema<Record<'dataType', string>>>
    > & { fieldNumber: number }
  >
> = {
  $id: `enevti/${SOCIAL_RAFFLE_PREFIX}/${RAFFLE_STATE_PREFIX}`,
  type: 'object',
  required: ['pool', 'registrar'],
  properties: {
    pool: {
      dataType: 'uint64',
      fieldNumber: 1,
    },
    registrar: {
      type: 'object',
      required: ['id', 'weight', 'candidate'],
      fieldNumber: 2,
      properties: {
        id: {
          dataType: 'bytes',
          fieldNumber: 1,
        },
        weight: {
          dataType: 'uint64',
          fieldNumber: 2,
        },
        candidate: {
          type: 'array',
          fieldNumber: 3,
          items: {
            dataType: 'bytes',
          },
        },
      },
    },
  },
};
