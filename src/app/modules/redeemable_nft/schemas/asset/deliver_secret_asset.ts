export const deliverSecretAssetSchema = {
  $id: 'enevti/redeemableNft/deliverSecretAsset',
  title: 'DeliverSecretAsset transaction asset for redeemableNft module',
  type: 'object',
  required: ['id', 'cipher', 'signature'],
  properties: {
    id: {
      dataType: 'string',
      fieldNumber: 1,
    },
    cipher: {
      dataType: 'string',
      fieldNumber: 2,
    },
    signature: {
      fieldNumber: 3,
      type: 'object',
      required: ['cipher', 'plain'],
      properties: {
        cipher: {
          dataType: 'string',
          fieldNumber: 1,
        },
        plain: {
          dataType: 'string',
          fieldNumber: 2,
        },
      },
    },
  },
};
