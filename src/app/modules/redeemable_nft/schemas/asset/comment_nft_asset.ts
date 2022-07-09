export const commentNftAssetSchema = {
  $id: 'enevti/redeemableNft/commentNftAsset',
  title: 'commentNftAsset transaction asset for redeemableNft module',
  type: 'object',
  required: ['id', 'text'],
  properties: {
    id: {
      dataType: 'string',
      fieldNumber: 1,
    },
    text: {
      dataType: 'string',
      fieldNumber: 2,
    },
  },
};
