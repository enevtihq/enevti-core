export type TokenToAddressMap = {
  address: string;
};

export const tokenToAddressSchema = {
  $id: 'fcm/tokenToAddress',
  type: 'object',
  required: ['address'],
  properties: {
    address: {
      fieldNumber: 1,
      dataType: 'string',
    },
  },
};
