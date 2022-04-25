import { SchemaWithDefault } from 'lisk-framework';

export const allNFTTemplateSchema: SchemaWithDefault = {
  $id: 'enevti/redeemableNft/allNftTemplate',
  type: 'object',
  required: ['items'],
  properties: {
    items: {
      type: 'array',
      fieldNumber: 1,
      items: {
        dataType: 'string',
      },
    },
  },
};

export const nftTemplateSchema: SchemaWithDefault = {
  $id: 'enevti/redeemableNft/template',
  type: 'object',
  required: ['id', 'name', 'description', 'data'],
  properties: {
    id: {
      dataType: 'string',
      fieldNumber: 1,
    },
    name: {
      dataType: 'string',
      fieldNumber: 2,
    },
    description: {
      dataType: 'string',
      fieldNumber: 3,
    },
    data: {
      fieldNumber: 4,
      type: 'object',
      required: ['main', 'thumbnail'],
      properties: {
        main: {
          fieldNumber: 1,
          type: 'array',
          items: {
            type: 'object',
            required: ['type', 'args'],
            properties: {
              type: {
                dataType: 'string',
                fieldNumber: 1,
              },
              args: {
                fieldNumber: 2,
                type: 'object',
                required: ['x', 'y', 'width', 'height', 'rotate'],
                properties: {
                  x: {
                    dataType: 'string',
                    fieldNumber: 1,
                  },
                  y: {
                    dataType: 'string',
                    fieldNumber: 2,
                  },
                  width: {
                    dataType: 'string',
                    fieldNumber: 3,
                  },
                  height: {
                    dataType: 'string',
                    fieldNumber: 4,
                  },
                  rotate: {
                    dataType: 'string',
                    fieldNumber: 5,
                  },
                },
              },
            },
          },
        },
        thumbnail: {
          fieldNumber: 2,
          type: 'array',
          items: {
            type: 'object',
            required: ['type', 'args'],
            properties: {
              type: {
                dataType: 'string',
                fieldNumber: 1,
              },
              args: {
                fieldNumber: 2,
                type: 'object',
                required: ['x', 'y', 'width', 'height', 'rotate'],
                properties: {
                  x: {
                    dataType: 'string',
                    fieldNumber: 1,
                  },
                  y: {
                    dataType: 'string',
                    fieldNumber: 2,
                  },
                  width: {
                    dataType: 'string',
                    fieldNumber: 3,
                  },
                  height: {
                    dataType: 'string',
                    fieldNumber: 4,
                  },
                  rotate: {
                    dataType: 'string',
                    fieldNumber: 5,
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
