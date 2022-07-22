export const likeReplyAssetSchema = {
  $id: 'enevti/redeemableNft/likeReplyAsset',
  title: 'likeReplyAsset transaction asset for redeemableNft module',
  type: 'object',
  required: ['id'],
  properties: {
    id: {
      dataType: 'string',
      fieldNumber: 1,
    },
  },
};
