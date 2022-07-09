import { SchemaWithDefault } from 'lisk-framework';

export const likeSchema: SchemaWithDefault = {
  $id: 'enevti/redeemableNft/like',
  type: 'object',
  required: ['address'],
  properties: {
    address: {
      type: 'array',
      fieldNumber: 1,
      items: {
        dataType: 'bytes',
      },
    },
  },
};

export const commentSchema: SchemaWithDefault = {
  $id: 'enevti/redeemableNft/comment',
  type: 'object',
  required: ['comment'],
  properties: {
    comment: {
      fieldNumber: 1,
      type: 'array',
      items: {
        type: 'object',
        required: ['type', 'date', 'owner', 'text', 'target'],
        properties: {
          type: {
            dataType: 'string',
            fieldNumber: 1,
          },
          date: {
            dataType: 'uint64',
            fieldNumber: 2,
          },
          owner: {
            dataType: 'bytes',
            fieldNumber: 3,
          },
          text: {
            dataType: 'string',
            fieldNumber: 4,
          },
          target: {
            dataType: 'bytes',
            fieldNumber: 5,
          },
        },
      },
    },
  },
};
