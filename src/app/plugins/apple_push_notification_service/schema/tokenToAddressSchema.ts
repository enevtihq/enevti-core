export type TokenToAddressMap = {
  address: string;
};

export const tokenToAddressSchema = {
  $id: 'apn/tokenToAddress',
  type: 'object',
  required: ['address'],
  properties: {
    address: {
      fieldNumber: 1,
      dataType: 'string',
    },
  },
};
