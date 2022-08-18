export const commentNftClubsAssetSchema = {
  $id: 'enevti/redeemableNft/commentNftClubsAsset',
  title: 'commentNftClubsAsset transaction asset for redeemableNft module',
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
