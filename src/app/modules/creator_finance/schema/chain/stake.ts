import { SchemaWithDefault } from 'lisk-framework';

export const stakerSchema: SchemaWithDefault = {
  $id: 'enevti/creatorFinance/staker',
  type: 'object',
  required: ['total', 'items'],
  properties: {
    total: {
      dataType: 'uint64',
      fieldNumber: 1,
    },
    items: {
      fieldNumber: 2,
      type: 'array',
      items: {
        type: 'object',
        required: ['persona', 'stake', 'rank', 'portion'],
        properties: {
          persona: {
            dataType: 'bytes',
            fieldNumber: 1,
          },
          stake: {
            dataType: 'uint64',
            fieldNumber: 2,
          },
          rank: {
            dataType: 'uint32',
            fieldNumber: 3,
          },
          portion: {
            dataType: 'uint32',
            fieldNumber: 4,
          },
        },
      },
    },
  },
};
