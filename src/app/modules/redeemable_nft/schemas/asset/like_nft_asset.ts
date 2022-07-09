export const likeNftAssetSchema = {
  $id: 'enevti/redeemableNft/likeNftAsset',
  title: 'likeNftAsset transaction asset for redeemableNft module',
  type: 'object',
  required: ['id'],
  properties: {
    id: {
      dataType: 'string',
      fieldNumber: 1,
    },
  },
};
