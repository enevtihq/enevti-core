import { SchemaWithDefault } from 'lisk-framework';

export const registeredUsernameSchema: SchemaWithDefault = {
  $id: 'enevti/persona/registeredUsername',
  type: 'object',
  required: ['address'],
  properties: {
    address: {
      dataType: 'bytes',
      fieldNumber: 1,
    },
  },
};
