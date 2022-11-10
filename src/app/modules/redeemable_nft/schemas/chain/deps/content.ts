import { Schema } from 'lisk-sdk';

export const contentSchema: Omit<Schema, '$id'> = {
  type: 'object',
  required: ['cid', 'mime', 'extension', 'size'],
  properties: {
    cid: {
      dataType: 'string',
      fieldNumber: 1,
    },
    mime: {
      dataType: 'string',
      fieldNumber: 2,
    },
    extension: {
      dataType: 'string',
      fieldNumber: 3,
    },
    size: {
      dataType: 'uint32',
      fieldNumber: 4,
    },
    protocol: {
      dataType: 'string',
      fieldNumber: 5,
    },
  },
};

export const nftContentSecureSchema: Omit<Schema, '$id'> = {
  ...contentSchema,
  required: contentSchema.required?.concat(['security']),
  properties: {
    ...contentSchema.properties,
    security: {
      dataType: 'string',
      fieldNumber: 6,
    },
  },
};
