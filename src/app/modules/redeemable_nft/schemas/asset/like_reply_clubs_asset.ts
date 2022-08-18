export const likeReplyClubsAssetSchema = {
  $id: 'enevti/redeemableNft/likeReplyClubsAsset',
  title: 'likeReplyClubsAsset transaction asset for redeemableNft module',
  type: 'object',
  required: ['id'],
  properties: {
    id: {
      dataType: 'string',
      fieldNumber: 1,
    },
  },
};
