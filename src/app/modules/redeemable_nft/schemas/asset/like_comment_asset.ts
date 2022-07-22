export const likeCommentAssetSchema = {
  $id: 'enevti/redeemableNft/likeCommentAsset',
  title: 'likeCommentAsset transaction asset for redeemableNft module',
  type: 'object',
  required: ['id'],
  properties: {
    id: {
      dataType: 'string',
      fieldNumber: 1,
    },
  },
};
