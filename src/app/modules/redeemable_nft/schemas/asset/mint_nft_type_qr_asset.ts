export const mintNftTypeQrAssetSchema = {
  $id: 'enevti/redeemableNft/mintNftTypeQrAsset',
  title: 'MintNftTypeQrAsset transaction asset for redeemableNft module',
  type: 'object',
  required: ['body', 'signature'],
  properties: {
    body: {
      dataType: 'string',
      fieldNumber: 1,
    },
    signature: {
      dataType: 'string',
      fieldNumber: 2,
    },
  },
};
