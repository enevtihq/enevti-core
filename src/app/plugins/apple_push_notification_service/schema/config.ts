import { SchemaWithDefault } from 'lisk-framework';

export type APNConfig = {
  apnKeyFileName: string;
  apnKeyId: string;
  apnTeamId: string;
  apnIsProduction: string;
};

export const applePushNotificationServiceSchema: SchemaWithDefault = {
  $id: '/plugins/plugin-applePushNotificationService/config',
  type: 'object',
  properties: {
    apnKeyFileName: {
      type: 'string',
    },
    apnKeyId: {
      type: 'string',
    },
    apnTeamId: {
      type: 'string',
    },
    apnIsProduction: {
      type: 'string',
    },
  },
  required: ['apnKeyFileName', 'apnKeyId', 'apnTeamId', 'apnIsProduction'],
  default: {
    apnKeyFileName: '',
    apnKeyId: '',
    apnTeamId: '',
    apnIsProduction: '',
  },
};
