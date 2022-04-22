import { RSchemaWithDefault } from '../../../../../types/core/chain/schema';

export const registeredNameSchema: RSchemaWithDefault = {
  $id: 'enevti/redeemableNft/registeredName',
  type: 'object',
  required: ['id'],
  properties: {
    id: {
      dataType: 'bytes',
      fieldNumber: 1,
    },
  },
  default: {
    id: Buffer.alloc(0),
  },
};

export const registeredSymbolSchema: RSchemaWithDefault = {
  $id: 'enevti/redeemableNft/registeredSymbol',
  type: 'object',
  required: ['id'],
  properties: {
    id: {
      dataType: 'bytes',
      fieldNumber: 1,
    },
  },
  default: {
    id: Buffer.alloc(0),
  },
};

export const registeredSerialSchema: RSchemaWithDefault = {
  $id: 'enevti/redeemableNft/registeredSerial',
  type: 'object',
  required: ['id'],
  properties: {
    id: {
      dataType: 'bytes',
      fieldNumber: 1,
    },
  },
  default: {
    id: Buffer.alloc(0),
  },
};
