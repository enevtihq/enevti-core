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
      dataType: 'string',
      fieldNumber: 3,
    },
  },
};
