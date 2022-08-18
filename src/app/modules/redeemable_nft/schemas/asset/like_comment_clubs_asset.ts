export const likeCommentClubsAssetSchema = {
  $id: 'enevti/redeemableNft/likeCommentClubsAsset',
  title: 'likeCommentClubsAsset transaction asset for redeemableNft module',
  type: 'object',
  required: ['id'],
  properties: {
    id: {
      dataType: 'string',
      fieldNumber: 1,
    },
  },
};
