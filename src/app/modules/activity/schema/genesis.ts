import { ActivityGenesisChain } from 'enevti-types/chain/activity';
import { StateSchemaFromType } from 'enevti-types/utils/schema';
import { ACTIVITY_PREFIX, GENESIS_ACTIVITY_PREFIX } from '../constants/codec';

export const activityGenesisSchema: StateSchemaFromType<ActivityGenesisChain> = {
  $id: `enevti/${ACTIVITY_PREFIX}/${GENESIS_ACTIVITY_PREFIX}`,
  type: 'object',
  required: ['state'],
  properties: {
    state: {
      dataType: 'string',
      fieldNumber: 1,
    },
  },
};
