export const setVideoCallRejectedAssetSchema = {
  $id: 'enevti/redeemableNft/setVideoCallRejectedAsset',
  title: 'setVideoCallRejectedAsset transaction asset for redeemableNft module',
  type: 'object',
  required: ['id', 'signature', 'publicKey'],
  properties: {
    id: {
      dataType: 'string',
      fieldNumber: 1,
    },
    signature: {
      dataType: 'string',
      fieldNumber: 2,
    },
    publicKey: {
      dataType: 'string',
      fieldNumber: 3,
    },
  },
};
