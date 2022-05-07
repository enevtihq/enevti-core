import { Schema } from 'lisk-sdk';

export const scheduleTimeSchema: Omit<Schema, '$id'> = {
  type: 'object',
  required: ['day', 'date', 'month', 'year'],
  properties: {
    day: {
      dataType: 'string',
      fieldNumber: 1,
    },
    date: {
      dataType: 'string',
      fieldNumber: 2,
    },
    month: {
      dataType: 'string',
      fieldNumber: 3,
    },
    year: {
      dataType: 'string',
      fieldNumber: 4,
    },
  },
};
