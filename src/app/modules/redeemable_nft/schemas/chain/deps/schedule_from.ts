import { Schema } from 'lisk-sdk';

export const scheduleFromSchema: Omit<Schema, '$id'> = {
  type: 'object',
  required: ['hour', 'minute'],
  properties: {
    hour: {
      dataType: 'sint32',
      fieldNumber: 1,
    },
    minute: {
      dataType: 'sint32',
      fieldNumber: 2,
    },
  },
};
