import { SchemaWithDefault } from 'lisk-framework';

export const registeredNameSchema: SchemaWithDefault = {
  $id: 'enevti/redeemableNft/registeredName',
  type: 'object',
  required: ['id'],
  properties: {
    id: {
      dataType: 'bytes',
      fieldNumber: 1,
    },
  },
};

export const registeredSymbolSchema: SchemaWithDefault = {
  $id: 'enevti/redeemableNft/registeredSymbol',
  type: 'object',
  required: ['id'],
  properties: {
    id: {
      dataType: 'bytes',
      fieldNumber: 1,
    },
  },
};

export const registeredSerialSchema: SchemaWithDefault = {
  $id: 'enevti/redeemableNft/registeredSerial',
  type: 'object',
  required: ['id'],
  properties: {
    id: {
      dataType: 'bytes',
      fieldNumber: 1,
    },
  },
};
