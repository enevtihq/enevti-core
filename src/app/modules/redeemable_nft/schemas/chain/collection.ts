import { SchemaWithDefault } from 'lisk-framework';
import { contentSchema } from './deps/content';
import { priceSchema } from './deps/price';

export const allCollectionSchema: SchemaWithDefault = {
  $id: 'enevti/redeemableNft/allCollection',
  type: 'object',
  required: ['items'],
  properties: {
    items: {
      type: 'array',
      fieldNumber: 1,
      items: {
        dataType: 'bytes',
      },
    },
  },
};

export const allUnavailableCollectionSchema: SchemaWithDefault = {
  $id: 'enevti/redeemableNft/allUnavailableCollection',
  type: 'object',
  required: ['items'],
  properties: {
    items: {
      type: 'array',
      fieldNumber: 1,
      items: {
        dataType: 'bytes',
      },
    },
  },
};

export const collectionSchema: SchemaWithDefault = {
  $id: 'enevti/redeemableNft/collection',
  type: 'object',
  required: [
    'id',
    'collectionType',
    'mintingType',
    'cover',
    'name',
    'description',
    'symbol',
    'creator',
    'createdOn',
    'like',
    'comment',
    'packSize',
    'stat',
    'minting',
    'minted',
    'social',
    'promoted',
    'raffled',
  ],
  properties: {
    id: {
      dataType: 'bytes',
      fieldNumber: 1,
    },
    collectionType: {
      dataType: 'string',
      fieldNumber: 2,
    },
    mintingType: {
      dataType: 'string',
      fieldNumber: 3,
    },
    cover: {
      ...contentSchema,
      fieldNumber: 4,
    },
    name: {
      dataType: 'string',
      fieldNumber: 5,
    },
    description: {
      dataType: 'string',
      fieldNumber: 6,
    },
    symbol: {
      dataType: 'string',
      fieldNumber: 7,
    },
    creator: {
      dataType: 'bytes',
      fieldNumber: 8,
    },
    createdOn: {
      dataType: 'uint64',
      fieldNumber: 9,
    },
    like: {
      dataType: 'uint32',
      fieldNumber: 10,
    },
    comment: {
      dataType: 'uint32',
      fieldNumber: 11,
    },
    packSize: {
      dataType: 'uint32',
      fieldNumber: 12,
    },
    stat: {
      fieldNumber: 13,
      type: 'object',
      required: ['minted', 'owner', 'redeemed', 'floor', 'volume'],
      properties: {
        minted: {
          dataType: 'uint32',
          fieldNumber: 1,
        },
        owner: {
          fieldNumber: 2,
          type: 'array',
          items: {
            dataType: 'bytes',
          },
        },
        redeemed: {
          dataType: 'uint32',
          fieldNumber: 3,
        },
        floor: {
          fieldNumber: 4,
          ...priceSchema,
        },
        volume: {
          fieldNumber: 5,
          ...priceSchema,
        },
      },
    },
    minting: {
      fieldNumber: 14,
      type: 'object',
      required: ['total', 'available', 'expire', 'price'],
      properties: {
        total: {
          fieldNumber: 1,
          type: 'array',
          items: {
            dataType: 'bytes',
          },
        },
        available: {
          fieldNumber: 2,
          type: 'array',
          items: {
            dataType: 'bytes',
          },
        },
        expire: {
          dataType: 'uint32',
          fieldNumber: 3,
        },
        price: {
          fieldNumber: 4,
          ...priceSchema,
        },
      },
    },
    minted: {
      fieldNumber: 15,
      type: 'array',
      items: {
        dataType: 'bytes',
      },
    },
    social: {
      fieldNumber: 16,
      type: 'object',
      required: ['twitter'],
      properties: {
        twitter: {
          dataType: 'string',
          fieldNumber: 1,
        },
      },
    },
    promoted: {
      dataType: 'boolean',
      fieldNumber: 17,
    },
    raffled: {
      dataType: 'sint32',
      fieldNumber: 18,
    },
  },
};
