import { RSchemaWithDefault } from '../../../../../types/core/chain/schema';

export const registeredUsernameSchema: RSchemaWithDefault = {
  $id: 'enevti/persona/registeredUsername',
  type: 'object',
  required: ['address'],
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
