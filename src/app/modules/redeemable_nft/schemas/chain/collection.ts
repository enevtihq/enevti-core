import { RSchemaWithDefault } from '../../../../../types/core/chain/schema';
import { contentSchema } from './deps/content';
import { priceSchema } from './deps/price';

export const allCollectionSchema: RSchemaWithDefault = {
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
  default: {
    items: [],
  },
};

export const collectionSchema: RSchemaWithDefault = {
  $id: 'enevti/redeemableNft/collection',
  type: 'object',
  required: [
    'id',
    'collectionType',
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
  ],
  properties: {
    id: {
      dataType: 'bytes',
      fieldNumber: 1,
    },
    containerType: {
      dataType: 'string',
      fieldNumber: 2,
    },
    cover: {
      ...contentSchema,
      fieldNumber: 3,
    },
    name: {
      dataType: 'string',
      fieldNumber: 4,
    },
    description: {
      dataType: 'string',
      fieldNumber: 5,
    },
    symbol: {
      dataType: 'string',
      fieldNumber: 6,
    },
    creator: {
      dataType: 'bytes',
      fieldNumber: 7,
    },
    createdOn: {
      dataType: 'uint32',
      fieldNumber: 8,
    },
    like: {
      dataType: 'uint32',
      fieldNumber: 9,
    },
    comment: {
      dataType: 'uint32',
      fieldNumber: 10,
    },
    packSize: {
      dataType: 'uint32',
      fieldNumber: 11,
    },
    stat: {
      fieldNumber: 12,
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
      fieldNumber: 13,
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
      fieldNumber: 14,
      type: 'array',
      items: {
        dataType: 'bytes',
      },
    },
    social: {
      fieldNumber: 15,
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
      fieldNumber: 16,
    },
  },
  default: {
    id: Buffer.alloc(0),
    collectionType: '',
    cover: {
      cid: '',
      mime: '',
      extension: '',
      size: 0,
    },
    name: '',
    description: '',
    symbol: '',
    creator: Buffer.alloc(0),
    createdOn: 0,
    like: 0,
    comment: 0,
    packSize: 0,
    stat: {
      minted: 0,
      owner: [],
      redeemed: 0,
      floor: {
        amount: '',
        currency: '',
      },
      volume: {
        amount: '',
        currency: '',
      },
    },
    minting: {
      total: [],
      available: [],
      expire: 0,
      price: {
        amount: '',
        currency: '',
      },
    },
    minted: [],
    social: {
      twitter: '',
    },
    promoted: false,
  },
};
