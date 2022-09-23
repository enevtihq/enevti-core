export const setVideoCallRejectedAssetSchema = {
  $id: 'enevti/redeemableNft/setVideoCallRejectedAsset',
  title: 'setVideoCallRejectedAsset transaction asset for redeemableNft module',
  type: 'object',
  required: ['id'],
  properties: {
    id: {
      dataType: 'string',
      fieldNumber: 1,
    },
  },
};
