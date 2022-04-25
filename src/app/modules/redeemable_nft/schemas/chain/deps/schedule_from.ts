import { Schema } from 'lisk-sdk';

export const scheduleFromSchema: Omit<Schema, '$id'> = {
  type: 'object',
  required: ['hour', 'minute'],
  properties: {
    hour: {
      dataType: 'uint32',
      fieldNumber: 1,
    },
    minute: {
      dataType: 'uint32',
      fieldNumber: 2,
    },
  },
};
