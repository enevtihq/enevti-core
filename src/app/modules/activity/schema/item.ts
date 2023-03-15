import { ActivityItemChain } from 'enevti-types/chain/activity';
import { StateSchemaFromType } from 'enevti-types/utils/schema';
import { ACTIVITY_PREFIX } from '../constants/codec';

export const activityItemSchema: StateSchemaFromType<ActivityItemChain> = {
  $id: `enevti/${ACTIVITY_PREFIX}/item`,
  type: 'object',
  required: [
    'key',
    'type',
    'previousActivityId',
    'transaction',
    'height',
    'diff',
    'patch',
    'amount',
    'payload',
  ],
  properties: {
    key: {
      dataType: 'string',
      fieldNumber: 1,
    },
    type: {
      dataType: 'string',
      fieldNumber: 2,
    },
    previousActivityId: {
      dataType: 'bytes',
      fieldNumber: 3,
    },
    transaction: {
      dataType: 'bytes',
      fieldNumber: 4,
    },
    height: {
      dataType: 'uint32',
      fieldNumber: 5,
    },
    diff: {
      dataType: 'string',
      fieldNumber: 6,
    },
    patch: {
      type: 'array',
      fieldNumber: 7,
      items: {
        dataType: 'string',
      },
    },
    amount: {
      dataType: 'uint64',
      fieldNumber: 8,
    },
    payload: {
      dataType: 'bytes',
      fieldNumber: 9,
    },
  },
};
