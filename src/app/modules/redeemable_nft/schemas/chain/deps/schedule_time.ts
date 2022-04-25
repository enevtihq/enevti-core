import { Schema } from 'lisk-sdk';

export const scheduleTimeSchema: Omit<Schema, '$id'> = {
  type: 'object',
  required: ['day', 'date', 'month', 'year'],
  properties: {
    day: {
      dataType: 'uint32',
      fieldNumber: 1,
    },
    date: {
      dataType: 'uint32',
      fieldNumber: 2,
    },
    month: {
      dataType: 'uint32',
      fieldNumber: 3,
    },
    year: {
      dataType: 'uint32',
      fieldNumber: 4,
    },
  },
};
