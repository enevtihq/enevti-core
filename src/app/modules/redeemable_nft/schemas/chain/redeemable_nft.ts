import { SchemaWithDefault } from 'lisk-framework';
import { contentSchema, nftContentSecureSchema } from './deps/content';
import { priceSchema } from './deps/price';
import { scheduleFromSchema } from './deps/schedule_from';
import { scheduleTimeSchema } from './deps/schedule_time';

export const allRedeemableNFTSchema: SchemaWithDefault = {
  $id: 'enevti/redeemableNft/allNft',
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

export const redeemableNFTSchema: SchemaWithDefault = {
  $id: 'enevti/redeemableNft/nft',
  type: 'object',
  required: [
    'id',
    'collectionId',
    'symbol',
    'serial',
    'name',
    'description',
    'createdOn',
    'networkIdentifier',
    'like',
    'comment',
    'owner',
    'creator',
    'data',
    'template',
    'nftType',
    'utility',
    'rarity',
    'partition',
    'redeem',
    'price',
    'onSale',
    'royalty',
  ],
  properties: {
    id: {
      dataType: 'bytes',
      fieldNumber: 1,
    },
    collectionId: {
      dataType: 'bytes',
      fieldNumber: 2,
    },
    symbol: {
      dataType: 'string',
      fieldNumber: 3,
    },
    serial: {
      dataType: 'string',
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
    createdOn: {
      dataType: 'uint64',
      fieldNumber: 7,
    },
    networkIdentifier: {
      dataType: 'bytes',
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
    owner: {
      dataType: 'bytes',
      fieldNumber: 11,
    },
    creator: {
      dataType: 'bytes',
      fieldNumber: 12,
    },
    data: {
      fieldNumber: 13,
      ...contentSchema,
    },
    template: {
      dataType: 'string',
      fieldNumber: 14,
    },
    nftType: {
      dataType: 'string',
      fieldNumber: 15,
    },
    utility: {
      dataType: 'string',
      fieldNumber: 16,
    },
    rarity: {
      fieldNumber: 17,
      type: 'object',
      required: ['stat', 'trait'],
      properties: {
        stat: {
          fieldNumber: 1,
          type: 'object',
          required: ['rank', 'percent'],
          properties: {
            rank: {
              dataType: 'sint32',
              fieldNumber: 1,
            },
            percent: {
              dataType: 'sint32',
              fieldNumber: 2,
            },
          },
        },
        trait: {
          fieldNumber: 2,
          type: 'array',
          items: {
            type: 'object',
            required: ['key', 'value'],
            properties: {
              key: {
                dataType: 'string',
                fieldNumber: 1,
              },
              value: {
                dataType: 'string',
                fieldNumber: 2,
              },
            },
          },
        },
      },
    },
    partition: {
      fieldNumber: 18,
      type: 'object',
      required: ['parts', 'upgradeMaterial'],
      properties: {
        parts: {
          fieldNumber: 1,
          type: 'array',
          items: {
            dataType: 'bytes',
          },
        },
        upgradeMaterial: {
          dataType: 'uint32',
          fieldNumber: 2,
        },
      },
    },
    redeem: {
      fieldNumber: 19,
      type: 'object',
      required: ['status', 'count', 'limit', 'touched', 'secret', 'content', 'schedule'],
      properties: {
        status: {
          dataType: 'string',
          fieldNumber: 1,
        },
        count: {
          dataType: 'uint32',
          fieldNumber: 2,
        },
        limit: {
          dataType: 'uint32',
          fieldNumber: 3,
        },
        touched: {
          dataType: 'uint64',
          fieldNumber: 4,
        },
        secret: {
          fieldNumber: 5,
          type: 'object',
          required: ['cipher', 'signature', 'sender', 'recipient'],
          properties: {
            cipher: {
              dataType: 'string',
              fieldNumber: 1,
            },
            signature: {
              fieldNumber: 2,
              type: 'object',
              required: ['cipher', 'plain'],
              properties: {
                cipher: {
                  dataType: 'string',
                  fieldNumber: 1,
                },
                plain: {
                  dataType: 'string',
                  fieldNumber: 2,
                },
              },
            },
            sender: {
              dataType: 'bytes',
              fieldNumber: 3,
            },
            recipient: {
              dataType: 'bytes',
              fieldNumber: 4,
            },
          },
        },
        content: {
          fieldNumber: 6,
          ...nftContentSecureSchema,
        },
        schedule: {
          fieldNumber: 7,
          type: 'object',
          required: ['recurring', 'time', 'from', 'until'],
          properties: {
            recurring: {
              dataType: 'string',
              fieldNumber: 1,
            },
            time: {
              fieldNumber: 2,
              ...scheduleTimeSchema,
            },
            from: {
              fieldNumber: 3,
              ...scheduleFromSchema,
            },
            until: {
              dataType: 'uint32',
              fieldNumber: 4,
            },
          },
        },
      },
    },
    price: {
      fieldNumber: 20,
      ...priceSchema,
    },
    onSale: {
      dataType: 'boolean',
      fieldNumber: 21,
    },
    royalty: {
      fieldNumber: 22,
      type: 'object',
      required: ['creator', 'staker'],
      properties: {
        creator: {
          dataType: 'uint32',
          fieldNumber: 1,
        },
        staker: {
          dataType: 'uint32',
          fieldNumber: 2,
        },
      },
    },
  },
};
