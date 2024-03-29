export const commentCollectionAssetSchema = {
  $id: 'enevti/redeemableNft/commentCollectionAsset',
  title: 'commentCollectionAsset transaction asset for redeemableNft module',
  type: 'object',
  required: ['id', 'cid'],
  properties: {
    id: {
      dataType: 'string',
      fieldNumber: 1,
    },
    cid: {
      dataType: 'string',
      fieldNumber: 2,
    },
  },
};
