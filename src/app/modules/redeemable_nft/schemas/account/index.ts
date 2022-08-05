import { AccountSchema } from 'lisk-framework';

export const redeemableNftAccountSchema: AccountSchema = {
  type: 'object',
  properties: {
    nftSold: {
      dataType: 'uint32',
      fieldNumber: 1,
    },
    treasuryAct: {
      dataType: 'uint32',
      fieldNumber: 2,
    },
    serveRate: {
      dataType: 'uint32',
      fieldNumber: 3,
    },
    raffled: {
      dataType: 'uint32',
      fieldNumber: 4,
    },
    owned: {
      fieldNumber: 5,
      type: 'array',
      items: {
        dataType: 'bytes',
      },
    },
    onSale: {
      fieldNumber: 6,
      type: 'array',
      items: {
        dataType: 'bytes',
      },
    },
    collection: {
      fieldNumber: 7,
      type: 'array',
      items: {
        dataType: 'bytes',
      },
    },
    pending: {
      fieldNumber: 8,
      type: 'array',
      items: {
        dataType: 'bytes',
      },
    },
  },
  default: {
    nftSold: 0,
    treasuryAct: 0,
    serveRate: 0,
    raffled: 0,
    owned: [],
    onSale: [],
    collection: [],
    pending: [],
  },
};
