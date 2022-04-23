import { RSchemaWithDefault } from '../../../../../types/core/chain/schema';

export const personaAccountSchema: RSchemaWithDefault = {
  $id: 'enevti/persona/account',
  type: 'object',
  required: ['photo'],
  properties: {
    photo: {
      dataType: 'string',
      fieldNumber: 1,
    },
  },
  default: {
    photo: '',
  },
};
