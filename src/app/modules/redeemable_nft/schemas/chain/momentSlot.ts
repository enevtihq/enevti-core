import { MomentSlotChain } from 'enevti-types/chain/moment';
import { StateSchemaFromType } from 'enevti-types/utils/schema';

export const momentSlotSchema: StateSchemaFromType<MomentSlotChain> = {
  $id: 'enevti/redeemableNft/momentSlot',
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
