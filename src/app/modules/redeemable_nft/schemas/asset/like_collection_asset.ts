export const likeCollectionAssetSchema = {
  $id: 'enevti/redeemableNft/likeCollectionAsset',
  title: 'likeCollectionAsset transaction asset for redeemableNft module',
  type: 'object',
  required: ['id'],
  properties: {
    id: {
      dataType: 'string',
      fieldNumber: 1,
    },
  },
};
