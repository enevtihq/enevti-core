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
        required: ['id', 'persona', 'stake', 'rank', 'portion'],
        properties: {
          id: {
            dataType: 'bytes',
            fieldNumber: 1,
          },
          persona: {
            dataType: 'bytes',
            fieldNumber: 2,
          },
          stake: {
            dataType: 'uint64',
            fieldNumber: 3,
          },
          rank: {
            dataType: 'uint32',
            fieldNumber: 4,
          },
          portion: {
            dataType: 'uint32',
            fieldNumber: 5,
          },
        },
      },
    },
  },
};
