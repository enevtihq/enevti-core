import { SocialRaffleCollectionChain } from 'enevti-types/chain/social_raffle';
import { StateSchemaFromType } from 'enevti-types/utils/schema';
import { COLLECTION_RAFFLE_CONFIG_PREFIX, SOCIAL_RAFFLE_PREFIX } from '../constants/codec';

export const collectionConfigSchema: StateSchemaFromType<SocialRaffleCollectionChain> = {
  $id: `enevti/${SOCIAL_RAFFLE_PREFIX}/${COLLECTION_RAFFLE_CONFIG_PREFIX}`,
  type: 'object',
  required: ['activated'],
  properties: {
    activated: {
      dataType: 'boolean',
      fieldNumber: 1,
    },
  },
};
