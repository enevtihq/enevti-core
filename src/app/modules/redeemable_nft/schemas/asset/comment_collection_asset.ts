export const commentCollectionAssetSchema = {
  $id: 'enevti/redeemableNft/commentCollectionAsset',
  title: 'commentCollectionAsset transaction asset for redeemableNft module',
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
