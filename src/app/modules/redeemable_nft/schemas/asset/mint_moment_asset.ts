export const mintMomentAssetSchema = {
  $id: 'enevti/redeemableNft/mintMomentAsset',
  title: 'mintMomentAsset transaction asset for redeemableNft module',
  type: 'object',
  required: [
    'nftId',
    'data',
    'dataMime',
    'dataExtension',
    'dataSize',
    'dataProtocol',
    'cover',
    'coverMime',
    'coverExtension',
    'coverSize',
    'coverProtocol',
    'text',
  ],
  properties: {
    nftId: {
      dataType: 'string',
      fieldNumber: 1,
    },
    data: {
      dataType: 'string',
      fieldNumber: 2,
    },
    dataMime: {
      dataType: 'string',
      fieldNumber: 3,
    },
    dataExtension: {
      dataType: 'string',
      fieldNumber: 4,
    },
    dataSize: {
      dataType: 'uint32',
      fieldNumber: 5,
    },
    dataProtocol: {
      dataType: 'string',
      fieldNumber: 6,
    },
    cover: {
      dataType: 'string',
      fieldNumber: 7,
    },
    coverMime: {
      dataType: 'string',
      fieldNumber: 8,
    },
    coverExtension: {
      dataType: 'string',
      fieldNumber: 9,
    },
    coverSize: {
      dataType: 'uint32',
      fieldNumber: 10,
    },
    coverProtocol: {
      dataType: 'string',
      fieldNumber: 11,
    },
    text: {
      dataType: 'string',
      fieldNumber: 12,
    },
  },
};
