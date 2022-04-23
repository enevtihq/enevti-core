import { RSchemaWithDefault } from '../../../../../types/core/chain/schema';
import { contentSchema, nftContentSecureSchema } from './deps/content';
import { priceSchema } from './deps/price';

export const allRedeemableNFTSchema: RSchemaWithDefault = {
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
  default: {
    items: [],
  },
};

export const redeemableNFTSchema: RSchemaWithDefault = {
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
    'NFTType',
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
      dataType: 'uint32',
      fieldNumber: 7,
    },
    networkIdentifier: {
      dataType: 'string',
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
    NFTType: {
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
              dataType: 'uint32',
              fieldNumber: 1,
            },
            percent: {
              dataType: 'uint32',
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
            dataType: 'string',
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
          dataType: 'uint32',
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
              dataType: 'string',
              fieldNumber: 2,
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
              type: 'object',
              required: ['day', 'date', 'month', 'year'],
              properties: {
                day: {
                  dataType: 'uint32',
                  fieldNumber: 1,
                },
                date: {
                  dataType: 'uint32',
                  fieldNumber: 2,
                },
                month: {
                  dataType: 'uint32',
                  fieldNumber: 3,
                },
                year: {
                  dataType: 'uint32',
                  fieldNumber: 4,
                },
              },
            },
            from: {
              fieldNumber: 3,
              type: 'object',
              required: ['hour', 'minute'],
              properties: {
                hour: {
                  dataType: 'uint32',
                  fieldNumber: 1,
                },
                minute: {
                  dataType: 'uint32',
                  fieldNumber: 2,
                },
              },
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
  default: {
    id: Buffer.alloc(0),
    collectionId: Buffer.alloc(0),
    symbol: '',
    serial: '',
    name: '',
    description: '',
    createdOn: 0,
    networkIdentifier: '',
    like: 0,
    comment: 0,
    owner: Buffer.alloc(0),
    creator: Buffer.alloc(0),
    data: {
      cid: '',
      mime: '',
      extension: '',
      size: 0,
    },
    template: '',
    NFTType: '',
    utility: '',
    rarity: {
      stat: {
        rank: 0,
        percent: 0,
      },
      trait: [],
    },
    partition: {
      parts: [],
      upgradeMaterial: 0,
    },
    redeem: {
      status: '',
      count: 0,
      limit: 0,
      touched: 0,
      secret: {
        cipher: '',
        signature: '',
        sender: Buffer.alloc(0),
        recipient: Buffer.alloc(0),
      },
      content: {
        cid: '',
        mime: '',
        extension: '',
        size: 0,
        iv: '',
        salt: '',
        version: 0,
      },
      schedule: {
        recurring: '',
        time: {
          day: 0,
          date: 0,
          month: 0,
          year: 0,
        },
        from: {
          hour: 0,
          minute: 0,
        },
        until: 0,
      },
    },
    price: {
      amount: '',
      currency: '',
    },
    onSale: false,
    royalty: {
      creator: 0,
      staker: 0,
    },
  },
};
