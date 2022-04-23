import { priceSchema } from '../chain/deps/price';
import { royaltySchema } from '../chain/deps/royalty';
import { scheduleFromSchema } from '../chain/deps/schedule_from';
import { scheduleTimeSchema } from '../chain/deps/schedule_time';

export const createOnekindNftAssetSchema = {
  $id: 'enevti/redeemableNft/createOnekindNftAsset',
  title: 'CreateOnekindNftAsset transaction asset for redeemableNft module',
  type: 'object',
  required: [
    'name',
    'description',
    'symbol',
    'cover',
    'coverMime',
    'coverExtension',
    'coverSize',
    'data',
    'dataMime',
    'dataExtension',
    'dataSize',
    'utility',
    'template',
    'cipher',
    'signature',
    'content',
    'contentMime',
    'contentExtension',
    'contentSize',
    'contentIv',
    'contentSalt',
    'contentSecurityVersion',
    'recurring',
    'time',
    'from',
    'until',
    'redeemLimit',
    'royalty',
    'price',
    'quantity',
    'mintingExpire',
  ],
  properties: {
    name: {
      dataType: 'string',
      fieldNumber: 1,
    },
    description: {
      dataType: 'string',
      fieldNumber: 2,
    },
    symbol: {
      dataType: 'string',
      fieldNumber: 3,
    },
    cover: {
      dataType: 'string',
      fieldNumber: 4,
    },
    coverMime: {
      dataType: 'string',
      fieldNumber: 5,
    },
    coverExtension: {
      dataType: 'string',
      fieldNumber: 6,
    },
    coverSize: {
      dataType: 'uint32',
      fieldNumber: 7,
    },
    data: {
      dataType: 'string',
      fieldNumber: 8,
    },
    dataMime: {
      dataType: 'string',
      fieldNumber: 9,
    },
    dataExtension: {
      dataType: 'string',
      fieldNumber: 10,
    },
    dataSize: {
      dataType: 'uint32',
      fieldNumber: 11,
    },
    utility: {
      dataType: 'string',
      fieldNumber: 12,
    },
    template: {
      dataType: 'string',
      fieldNumber: 13,
    },
    cipher: {
      dataType: 'string',
      fieldNumber: 14,
    },
    signature: {
      dataType: 'string',
      fieldNumber: 15,
    },
    content: {
      dataType: 'string',
      fieldNumber: 16,
    },
    contentMime: {
      dataType: 'string',
      fieldNumber: 17,
    },
    contentExtension: {
      dataType: 'string',
      fieldNumber: 18,
    },
    contentSize: {
      dataType: 'uint32',
      fieldNumber: 19,
    },
    contentIv: {
      dataType: 'string',
      fieldNumber: 20,
    },
    contentSalt: {
      dataType: 'string',
      fieldNumber: 21,
    },
    contentSecurityVersion: {
      dataType: 'string',
      fieldNumber: 22,
    },
    recurring: {
      dataType: 'string',
      fieldNumber: 23,
    },
    time: {
      fieldNumber: 24,
      ...scheduleTimeSchema,
    },
    from: {
      fieldNumber: 25,
      ...scheduleFromSchema,
    },
    until: {
      dataType: 'uint32',
      fieldNumber: 26,
    },
    redeemLimit: {
      dataType: 'uint32',
      fieldNumber: 27,
    },
    royalty: {
      fieldNumber: 28,
      ...royaltySchema,
    },
    price: {
      fieldNumber: 29,
      ...priceSchema,
    },
    quantity: {
      dataType: 'uint32',
      fieldNumber: 30,
    },
    mintingExpire: {
      dataType: 'uint32',
      fieldNumber: 31,
    },
  },
};
