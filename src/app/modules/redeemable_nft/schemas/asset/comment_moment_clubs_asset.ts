export const commentMomentClubsAssetSchema = {
  $id: 'enevti/redeemableMoment/commentMomentClubsAsset',
  title: 'commentMomentClubsAsset transaction asset for redeemableMoment module',
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
