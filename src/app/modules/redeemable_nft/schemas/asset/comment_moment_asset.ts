export const commentMomentAssetSchema = {
  $id: 'enevti/redeemableMoment/commentMomentAsset',
  title: 'commentMomentAsset transaction asset for redeemableMoment module',
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
