import { RSchemaWithDefault } from '../../../../../types/core/chain/schema';

export const personaAccountSchema: RSchemaWithDefault = {
  $id: 'enevti/persona/account',
  type: 'object',
  required: ['photo', 'username', 'social'],
  properties: {
    photo: {
      dataType: 'string',
      fieldNumber: 1,
    },
    username: {
      dataType: 'string',
      fieldNumber: 2,
    },
    social: {
      fieldNumber: 3,
      type: 'object',
      required: ['twitter'],
      properties: {
        twitter: {
          dataType: 'string',
          fieldNumber: 1,
        },
      },
    },
  },
  default: {
    photo: '',
    username: '',
    social: {
      twitter: '',
    },
  },
};
