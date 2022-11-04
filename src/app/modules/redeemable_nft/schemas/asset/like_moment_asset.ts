export const likeMomentAssetSchema = {
  $id: 'enevti/redeemableMoment/likeMomentAsset',
  title: 'likeMomentAsset transaction asset for redeemableMoment module',
  type: 'object',
  required: ['id'],
  properties: {
    id: {
      dataType: 'string',
      fieldNumber: 1,
    },
  },
};
