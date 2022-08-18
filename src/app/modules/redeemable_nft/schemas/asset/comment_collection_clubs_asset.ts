export const commentCollectionClubsAssetSchema = {
  $id: 'enevti/redeemableNft/commentCollectionClubsAsset',
  title: 'commentCollectionClubsAsset transaction asset for redeemableNft module',
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
