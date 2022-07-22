import { SchemaWithDefault } from 'lisk-framework';

export const likeAtSchema: SchemaWithDefault = {
  $id: 'enevti/redeemableNft/likeAt',
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

export const likedAtSchema: SchemaWithDefault = {
  $id: 'enevti/redeemableNft/likedAt',
  type: 'object',
  required: ['status'],
  properties: {
    status: {
      dataType: 'uint32',
      fieldNumber: 1,
    },
  },
};

export const commentAtSchema: SchemaWithDefault = {
  $id: 'enevti/redeemableNft/commentAt',
  type: 'object',
  required: ['comment'],
  properties: {
    comment: {
      fieldNumber: 1,
      type: 'array',
      items: {
        dataType: 'bytes',
      },
    },
  },
};

export const commentSchema: SchemaWithDefault = {
  $id: 'enevti/redeemableNft/comment',
  type: 'object',
  required: ['id', 'type', 'date', 'owner', 'text', 'target', 'reply', 'like'],
  properties: {
    id: {
      dataType: 'bytes',
      fieldNumber: 1,
    },
    type: {
      dataType: 'string',
      fieldNumber: 2,
    },
    date: {
      dataType: 'uint64',
      fieldNumber: 3,
    },
    owner: {
      dataType: 'bytes',
      fieldNumber: 4,
    },
    text: {
      dataType: 'string',
      fieldNumber: 5,
    },
    target: {
      dataType: 'bytes',
      fieldNumber: 6,
    },
    reply: {
      dataType: 'uint32',
      fieldNumber: 7,
    },
    like: {
      dataType: 'uint32',
      fieldNumber: 8,
    },
  },
};

export const replyAtSchema: SchemaWithDefault = {
  $id: 'enevti/redeemableNft/replyAt',
  type: 'object',
  required: ['reply'],
  properties: {
    reply: {
      fieldNumber: 1,
      type: 'array',
      items: {
        dataType: 'bytes',
      },
    },
  },
};

export const replySchema: SchemaWithDefault = {
  $id: 'enevti/redeemableNft/reply',
  type: 'object',
  required: ['id', 'date', 'owner', 'text', 'target', 'like'],
  properties: {
    id: {
      dataType: 'bytes',
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
    like: {
      dataType: 'uint32',
      fieldNumber: 6,
    },
  },
};
