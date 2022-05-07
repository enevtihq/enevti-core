import { Schema } from 'lisk-sdk';

export const scheduleFromSchema: Omit<Schema, '$id'> = {
  type: 'object',
  required: ['hour', 'minute'],
  properties: {
    hour: {
      dataType: 'string',
      fieldNumber: 1,
    },
    minute: {
      dataType: 'string',
      fieldNumber: 2,
    },
  },
};
