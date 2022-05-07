import { SchemaWithDefault } from 'lisk-framework';
import { priceSchema } from './deps/price';

export const activityNFTSchema: SchemaWithDefault = {
  $id: 'enevti/redeemableNft/activityNft',
  type: 'object',
  required: ['items'],
  properties: {
    items: {
      type: 'array',
      fieldNumber: 1,
      items: {
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
  },
};

export const activityCollectionSchema: SchemaWithDefault = {
  $id: 'enevti/redeemableNft/activityCollection',
  type: 'object',
  required: ['items'],
  properties: {
    items: {
      type: 'array',
      fieldNumber: 1,
      items: {
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
  },
};
