import { Schema } from 'lisk-sdk';

export const royaltySchema: Omit<Schema, '$id'> = {
  type: 'object',
  required: ['creator', 'staker'],
  properties: {
    creator: {
      dataType: 'uint32',
      fieldNumber: 1,
    },
    staker: {
      dataType: 'uint32',
      fieldNumber: 2,
    },
  },
};
