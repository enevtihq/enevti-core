export const commentNftAssetSchema = {
  $id: 'enevti/redeemableNft/commentNftAsset',
  title: 'commentNftAsset transaction asset for redeemableNft module',
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
