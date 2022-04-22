import { RSchemaWithDefault } from '../../../../../types/core/chain/schema';

export const stakerSchema: RSchemaWithDefault = {
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
        required: ['address', 'stake', 'rank', 'portion'],
        properties: {
          address: {
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
  default: {
    total: '0',
    items: [],
  },
};
