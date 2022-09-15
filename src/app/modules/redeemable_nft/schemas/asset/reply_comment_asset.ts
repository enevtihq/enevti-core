export const replyCommentAssetSchema = {
  $id: 'enevti/redeemableNft/replyCommentAsset',
  title: 'replyCommentAsset transaction asset for redeemableNft module',
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
