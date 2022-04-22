export const mintNftAssetSchema = {
  $id: 'enevti/redeemableNft/mintNftAsset',
  title: 'MintNftAsset transaction asset for redeemableNft module',
  type: 'object',
  required: ['id', 'quantity'],
  properties: {
    id: {
      dataType: 'string',
      fieldNumber: 1,
    },
    quantity: {
      dataType: 'uint32',
      fieldNumber: 2,
    },
  },
};
