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
            dataType: 'uint64',
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
        required: ['transaction', 'name', 'date', 'to', 'value', 'nfts'],
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
            dataType: 'uint64',
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
          nfts: {
            type: 'array',
            fieldNumber: 6,
            items: {
              dataType: 'bytes',
            },
          },
        },
      },
    },
  },
};

export const activityProfileSchema: SchemaWithDefault = {
  $id: 'enevti/redeemableNft/activityProfile',
  type: 'object',
  required: ['items'],
  properties: {
    items: {
      type: 'array',
      fieldNumber: 1,
      items: {
        type: 'object',
        required: ['transaction', 'name', 'date', 'from', 'to', 'value', 'payload'],
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
            dataType: 'uint64',
            fieldNumber: 3,
          },
          from: {
            dataType: 'bytes',
            fieldNumber: 4,
          },
          to: {
            dataType: 'bytes',
            fieldNumber: 5,
          },
          value: {
            ...priceSchema,
            fieldNumber: 6,
          },
          payload: {
            dataType: 'bytes',
            fieldNumber: 7,
          },
        },
      },
    },
  },
};
