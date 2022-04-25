import { AccountSchema } from 'lisk-framework';

export const personaAccountSchema: AccountSchema = {
  type: 'object',
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
