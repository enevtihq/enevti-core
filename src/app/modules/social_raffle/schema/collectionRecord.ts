import { SocialRaffleCollectionRecord } from 'enevti-types/chain/social_raffle';
import { StateSchemaFromType } from 'enevti-types/utils/schema';
import { COLLECTION_RECORD_PREFIX, SOCIAL_RAFFLE_PREFIX } from '../constants/codec';

export const collectionRecordSchema: StateSchemaFromType<SocialRaffleCollectionRecord> = {
  $id: `enevti/${SOCIAL_RAFFLE_PREFIX}/${COLLECTION_RECORD_PREFIX}`,
  type: 'object',
  required: ['height'],
  properties: {
    height: {
      dataType: 'uint32',
      fieldNumber: 1,
    },
  },
};
