import { SchemaWithDefault } from 'lisk-framework';

export const buybackSchema: SchemaWithDefault = {
  $id: 'enevti/redeemableNft/buyback',
  type: 'object',
  required: ['registrar'],
  properties: {
    registrar: {
      fieldNumber: 1,
      type: 'array',
      items: {
        type: 'object',
        required: ['collectionId', 'weight', 'candidate'],
        properties: {
          collectionId: {
            dataType: 'bytes',
            fieldNumber: 1,
          },
          weight: {
            dataType: 'uint64',
            fieldNumber: 2,
          },
          candidate: {
            dataType: 'bytes',
            fieldNumber: 3,
          },
        },
      },
    },
  },
};
