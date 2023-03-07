import { SocialRaffleAddressRecord } from 'enevti-types/chain/social_raffle';
import { StateSchemaFromType } from 'enevti-types/utils/schema';
import { ADDRESS_RECORD_PREFIX, SOCIAL_RAFFLE_PREFIX } from '../constants/codec';

export const addressRecordSchema: StateSchemaFromType<SocialRaffleAddressRecord> = {
  $id: `enevti/${SOCIAL_RAFFLE_PREFIX}/${ADDRESS_RECORD_PREFIX}`,
  type: 'object',
  required: ['height', 'collection'],
  properties: {
    height: {
      dataType: 'uint32',
      fieldNumber: 1,
    },
    collection: {
      dataType: 'bytes',
      fieldNumber: 2,
    },
  },
};
