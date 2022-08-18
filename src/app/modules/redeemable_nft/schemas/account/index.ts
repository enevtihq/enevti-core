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
    likeSent: {
      dataType: 'uint32',
      fieldNumber: 5,
    },
    commentSent: {
      dataType: 'uint32',
      fieldNumber: 6,
    },
    commentClubsSent: {
      dataType: 'uint32',
      fieldNumber: 7,
    },
    owned: {
      fieldNumber: 8,
      type: 'array',
      items: {
        dataType: 'bytes',
      },
    },
    onSale: {
      fieldNumber: 9,
      type: 'array',
      items: {
        dataType: 'bytes',
      },
    },
    collection: {
      fieldNumber: 10,
      type: 'array',
      items: {
        dataType: 'bytes',
      },
    },
    pending: {
      fieldNumber: 11,
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
    likeSent: 0,
    commentSent: 0,
    commentClubsSent: 0,
    owned: [],
    onSale: [],
    collection: [],
    pending: [],
  },
};
