import { RSchemaWithDefault } from '../../../../../types/core/chain/schema';

export const redeemableNftAccountSchema: RSchemaWithDefault = {
  $id: 'enevti/redeemableNft/account',
  type: 'object',
  required: ['nftSold', 'treasuryAct', 'serveRate', 'owned', 'onSale', 'collection'],
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
    owned: {
      fieldNumber: 4,
      type: 'array',
      items: {
        dataType: 'bytes',
      },
    },
    onSale: {
      fieldNumber: 5,
      type: 'array',
      items: {
        dataType: 'bytes',
      },
    },
    collection: {
      fieldNumber: 6,
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
    owned: [],
    onSale: [],
    collection: [],
  },
};
