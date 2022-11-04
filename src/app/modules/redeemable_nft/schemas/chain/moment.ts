import { SchemaWithDefault } from 'lisk-framework';
import { contentSchema } from './deps/content';

export const allMomentSchema: SchemaWithDefault = {
  $id: 'enevti/redeemableNft/allMoment',
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

export const momentAtSchema: SchemaWithDefault = {
  $id: 'enevti/redeemableNft/momentAt',
  type: 'object',
  required: ['moment'],
  properties: {
    moment: {
      type: 'array',
      fieldNumber: 1,
      items: {
        dataType: 'bytes',
      },
    },
  },
};

export const momentSchema: SchemaWithDefault = {
  $id: 'enevti/redeemableNft/moment',
  type: 'object',
  required: [
    'id',
    'nftId',
    'owner',
    'creator',
    'createdOn',
    'data',
    'cover',
    'text',
    'like',
    'comment',
    'clubs',
  ],
  properties: {
    id: {
      dataType: 'bytes',
      fieldNumber: 1,
    },
    nftId: {
      dataType: 'bytes',
      fieldNumber: 2,
    },
    owner: {
      dataType: 'bytes',
      fieldNumber: 3,
    },
    creator: {
      dataType: 'bytes',
      fieldNumber: 4,
    },
    createdOn: {
      dataType: 'uint64',
      fieldNumber: 5,
    },
    data: {
      ...contentSchema,
      fieldNumber: 6,
    },
    cover: {
      ...contentSchema,
      fieldNumber: 7,
    },
    text: {
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
    clubs: {
      dataType: 'uint32',
      fieldNumber: 11,
    },
  },
};
