import { SchemaWithDefault } from 'lisk-framework';

export const enevtiCallSocketSchema: SchemaWithDefault = {
  $id: '/plugins/plugin-enevtiCallSocket/config',
  type: 'object',
  properties: {
    twilioAccountSid: {
      type: 'string',
    },
    twilioApiKeySid: {
      type: 'string',
    },
    twilioApiKeySecret: {
      type: 'string',
    },
  },
  required: ['twilioAccountSid', 'twilioApiKeySid', 'twilioApiKeySecret'],
  default: {
    twilioAccountSid: '',
    twilioApiKeySid: '',
    twilioApiKeySecret: '',
  },
};
