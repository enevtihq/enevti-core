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
    momentSlot: {
      dataType: 'uint32',
      fieldNumber: 5,
    },
    momentCreated: {
      dataType: 'uint32',
      fieldNumber: 6,
    },
    likeSent: {
      dataType: 'uint32',
      fieldNumber: 7,
    },
    commentSent: {
      dataType: 'uint32',
      fieldNumber: 8,
    },
    commentClubsSent: {
      dataType: 'uint32',
      fieldNumber: 9,
    },
    owned: {
      fieldNumber: 10,
      type: 'array',
      items: {
        dataType: 'bytes',
      },
    },
    onSale: {
      fieldNumber: 11,
      type: 'array',
      items: {
        dataType: 'bytes',
      },
    },
    collection: {
      fieldNumber: 12,
      type: 'array',
      items: {
        dataType: 'bytes',
      },
    },
    pending: {
      fieldNumber: 13,
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
    momentSlot: 0,
    momentCreated: 0,
    likeSent: 0,
    commentSent: 0,
    commentClubsSent: 0,
    owned: [],
    onSale: [],
    collection: [],
    pending: [],
  },
};
