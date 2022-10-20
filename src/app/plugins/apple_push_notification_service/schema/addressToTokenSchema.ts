export type AddressToTokenMap = {
  token: string;
};

export const addressToTokenSchema = {
  $id: 'apn/addressToToken',
  type: 'object',
  required: ['token'],
  properties: {
    token: {
      fieldNumber: 1,
      dataType: 'string',
    },
  },
};
