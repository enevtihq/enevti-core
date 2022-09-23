export const setVideoCallAnsweredAssetSchema = {
  $id: 'enevti/redeemableNft/setVideoCallAnsweredAsset',
  title: 'setVideoCallAnsweredAsset transaction asset for redeemableNft module',
  type: 'object',
  required: ['id'],
  properties: {
    id: {
      dataType: 'string',
      fieldNumber: 1,
    },
  },
};
