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
  required: contentSchema.required?.concat(['iv', 'salt', 'version']),
  properties: {
    ...contentSchema.properties,
    iv: {
      dataType: 'string',
      fieldNumber: 6,
    },
    salt: {
      dataType: 'string',
      fieldNumber: 7,
    },
    version: {
      dataType: 'uint32',
      fieldNumber: 8,
    },
  },
};
