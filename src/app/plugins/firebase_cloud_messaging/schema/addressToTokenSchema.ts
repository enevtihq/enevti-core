export type AddressToTokenMap = {
  token: string;
};

export const addressToTokenSchema = {
  $id: 'fcm/addressToToken',
  type: 'object',
  required: ['token'],
  properties: {
    token: {
      fieldNumber: 1,
      dataType: 'string',
    },
  },
};
