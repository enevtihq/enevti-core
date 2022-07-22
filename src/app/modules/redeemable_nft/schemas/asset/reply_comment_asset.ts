export const replyCommentAssetSchema = {
  $id: 'enevti/redeemableNft/replyCommentAsset',
  title: 'replyCommentAsset transaction asset for redeemableNft module',
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
