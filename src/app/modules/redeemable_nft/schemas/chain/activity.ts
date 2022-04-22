import { RSchemaWithDefault } from '../../../../../types/core/chain/schema';
import { priceSchema } from './deps/price';

export const activityNFTSchema: RSchemaWithDefault = {
  $id: 'enevti/redeemableNft/activityNft',
  type: 'object',
  required: ['items'],
  properties: {
    items: {
      fieldNumber: 1,
      type: 'object',
      required: ['transaction', 'name', 'date', 'to', 'value'],
      properties: {
        transaction: {
          dataType: 'bytes',
          fieldNumber: 1,
        },
        name: {
          dataType: 'string',
          fieldNumber: 2,
        },
        date: {
          dataType: 'uint32',
          fieldNumber: 3,
        },
        to: {
          dataType: 'bytes',
          fieldNumber: 4,
        },
        value: priceSchema,
      },
    },
  },
  default: {
    items: [],
  },
};

export const activityCollectionSchema: RSchemaWithDefault = {
  $id: 'enevti/redeemableNft/activityCollection',
  type: 'object',
  required: ['items'],
  properties: {
    items: {
      fieldNumber: 1,
      type: 'object',
      required: ['transaction', 'name', 'date', 'to', 'value', 'nft'],
      properties: {
        transaction: {
          dataType: 'bytes',
          fieldNumber: 1,
        },
        name: {
          dataType: 'string',
          fieldNumber: 2,
        },
        date: {
          dataType: 'uint32',
          fieldNumber: 3,
        },
        to: {
          dataType: 'bytes',
          fieldNumber: 4,
        },
        value: {
          ...priceSchema,
          fieldNumber: 5,
        },
        nft: {
          dataType: 'bytes',
          fieldNumber: 6,
        },
      },
    },
  },
  default: {
    items: [],
  },
};
