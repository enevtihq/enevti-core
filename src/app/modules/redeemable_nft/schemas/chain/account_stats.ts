import { SchemaWithDefault } from 'lisk-framework';

export const accountStatsSchema: SchemaWithDefault = {
  $id: 'enevti/redeemableNft/accountStats',
  type: 'object',
  required: ['nftSold', 'raffled', 'treasuryAct', 'serveRate', 'likeSent'],
  properties: {
    nftSold: {
      fieldNumber: 1,
      type: 'array',
      items: {
        dataType: 'bytes',
      },
    },
    raffled: {
      fieldNumber: 2,
      type: 'array',
      items: {
        dataType: 'bytes',
      },
    },
    treasuryAct: {
      fieldNumber: 3,
      type: 'array',
      items: {
        dataType: 'bytes',
      },
    },
    serveRate: {
      fieldNumber: 4,
      type: 'object',
      required: ['score', 'items'],
      properties: {
        score: {
          dataType: 'uint32',
          fieldNumber: 1,
        },
        items: {
          fieldNumber: 2,
          type: 'array',
          items: {
            type: 'object',
            required: ['id', 'nonce', 'status'],
            properties: {
              id: {
                dataType: 'bytes',
                fieldNumber: 1,
              },
              nonce: {
                dataType: 'uint32',
                fieldNumber: 2,
              },
              status: {
                dataType: 'uint32',
                fieldNumber: 3,
              },
            },
          },
        },
      },
    },
    likeSent: {
      fieldNumber: 5,
      type: 'object',
      required: ['total', 'nft', 'collection', 'comment', 'reply'],
      properties: {
        total: {
          dataType: 'uint32',
          fieldNumber: 1,
        },
        nft: {
          fieldNumber: 2,
          type: 'array',
          items: {
            dataType: 'bytes',
          },
        },
        collection: {
          fieldNumber: 3,
          type: 'array',
          items: {
            dataType: 'bytes',
          },
        },
        comment: {
          fieldNumber: 4,
          type: 'array',
          items: {
            dataType: 'bytes',
          },
        },
        reply: {
          fieldNumber: 5,
          type: 'array',
          items: {
            dataType: 'bytes',
          },
        },
      },
    },
  },
};