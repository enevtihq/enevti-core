import { SchemaWithDefault } from 'lisk-framework';

export const socialRaffleSchema: SchemaWithDefault = {
  $id: 'enevti/redeemableNft/socialRaffle',
  type: 'object',
  required: ['pool', 'registrar'],
  properties: {
    pool: {
      fieldNumber: 1,
      dataType: 'uint64',
    },
    registrar: {
      fieldNumber: 2,
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'weight', 'candidate'],
        properties: {
          id: {
            dataType: 'bytes',
            fieldNumber: 1,
          },
          weight: {
            dataType: 'uint64',
            fieldNumber: 2,
          },
          candidate: {
            fieldNumber: 3,
            type: 'array',
            items: {
              dataType: 'bytes',
            },
          },
        },
      },
    },
  },
};

export const socialRaffleRecordSchema: SchemaWithDefault = {
  $id: 'enevti/redeemableNft/socialRaffleRecord',
  type: 'object',
  required: ['items'],
  properties: {
    items: {
      fieldNumber: 1,
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'winner', 'raffled'],
        properties: {
          id: {
            dataType: 'bytes',
            fieldNumber: 1,
          },
          winner: {
            dataType: 'bytes',
            fieldNumber: 2,
          },
          raffled: {
            fieldNumber: 3,
            type: 'array',
            items: {
              dataType: 'bytes',
            },
          },
        },
      },
    },
  },
};
