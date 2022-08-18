import { SchemaWithDefault } from 'lisk-framework';

export const accountStatsSchema: SchemaWithDefault = {
  $id: 'enevti/redeemableNft/accountStats',
  type: 'object',
  required: [
    'nftSold',
    'raffled',
    'treasuryAct',
    'serveRate',
    'likeSent',
    'commentSent',
    'commentClubsSent',
  ],
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
      required: ['total', 'nft', 'collection', 'comment', 'reply', 'commentClubs', 'replyClubs'],
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
        commentClubs: {
          fieldNumber: 6,
          type: 'array',
          items: {
            dataType: 'bytes',
          },
        },
        replyClubs: {
          fieldNumber: 7,
          type: 'array',
          items: {
            dataType: 'bytes',
          },
        },
      },
    },
    commentSent: {
      fieldNumber: 6,
      type: 'object',
      required: ['total', 'comment', 'reply'],
      properties: {
        total: {
          dataType: 'uint32',
          fieldNumber: 1,
        },
        comment: {
          fieldNumber: 2,
          type: 'array',
          items: {
            dataType: 'bytes',
          },
        },
        reply: {
          fieldNumber: 3,
          type: 'array',
          items: {
            dataType: 'bytes',
          },
        },
      },
    },
    commentClubsSent: {
      fieldNumber: 7,
      type: 'object',
      required: ['total', 'comment', 'reply'],
      properties: {
        total: {
          dataType: 'uint32',
          fieldNumber: 1,
        },
        comment: {
          fieldNumber: 2,
          type: 'array',
          items: {
            dataType: 'bytes',
          },
        },
        reply: {
          fieldNumber: 3,
          type: 'array',
          items: {
            dataType: 'bytes',
          },
        },
      },
    },
  },
};
