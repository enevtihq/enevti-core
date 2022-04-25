import { SchemaWithDefault } from 'lisk-framework';

export const registeredUsernameSchema: SchemaWithDefault = {
  $id: 'enevti/persona/registeredUsername',
  type: 'object',
  required: ['address'],
  properties: {
    id: {
      dataType: 'bytes',
      fieldNumber: 1,
    },
  },
};
