import { Schema } from 'lisk-sdk';

export const priceSchema: Omit<Schema, '$id'> = {
  type: 'object',
  required: ['amount', 'currency'],
  properties: {
    amount: {
      dataType: 'uint64',
      fieldNumber: 1,
    },
    currency: {
      dataType: 'string',
      fieldNumber: 2,
    },
  },
};
