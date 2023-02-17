import { StateSchemaFromType } from 'enevti-types/utils/schema';
import { ActivityListChain } from 'enevti-types/chain/activity';
import { ACTIVITY_PREFIX } from '../constants/codec';

export const activityListSchema: StateSchemaFromType<ActivityListChain> = {
  $id: `enevti/${ACTIVITY_PREFIX}/list`,
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
