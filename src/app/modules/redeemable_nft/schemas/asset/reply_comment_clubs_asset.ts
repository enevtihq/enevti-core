export const replyCommentClubsAssetSchema = {
  $id: 'enevti/redeemableNft/replyCommentClubsAsset',
  title: 'replyCommentClubsAsset transaction asset for redeemableNft module',
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
