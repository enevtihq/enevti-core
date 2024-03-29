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
    'mintingType',
    'symbol',
    'cover',
    'coverMime',
    'coverExtension',
    'coverSize',
    'coverProtocol',
    'data',
    'dataMime',
    'dataExtension',
    'dataSize',
    'dataProtocol',
    'utility',
    'template',
    'cipher',
    'signature',
    'content',
    'contentMime',
    'contentExtension',
    'contentSize',
    'contentProtocol',
    'contentSecurity',
    'recurring',
    'time',
    'from',
    'until',
    'redeemNonceLimit',
    'redeemCountLimit',
    'royalty',
    'price',
    'quantity',
    'mintingExpire',
    'raffled',
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
    mintingType: {
      dataType: 'string',
      fieldNumber: 3,
    },
    symbol: {
      dataType: 'string',
      fieldNumber: 4,
    },
    cover: {
      dataType: 'string',
      fieldNumber: 5,
    },
    coverMime: {
      dataType: 'string',
      fieldNumber: 6,
    },
    coverExtension: {
      dataType: 'string',
      fieldNumber: 7,
    },
    coverSize: {
      dataType: 'uint32',
      fieldNumber: 8,
    },
    coverProtocol: {
      dataType: 'string',
      fieldNumber: 9,
    },
    data: {
      dataType: 'string',
      fieldNumber: 10,
    },
    dataMime: {
      dataType: 'string',
      fieldNumber: 11,
    },
    dataExtension: {
      dataType: 'string',
      fieldNumber: 12,
    },
    dataSize: {
      dataType: 'uint32',
      fieldNumber: 13,
    },
    dataProtocol: {
      dataType: 'string',
      fieldNumber: 14,
    },
    utility: {
      dataType: 'string',
      fieldNumber: 15,
    },
    template: {
      dataType: 'string',
      fieldNumber: 16,
    },
    cipher: {
      dataType: 'string',
      fieldNumber: 17,
    },
    signature: {
      fieldNumber: 18,
      type: 'object',
      required: ['cipher', 'plain'],
      properties: {
        cipher: {
          dataType: 'string',
          fieldNumber: 1,
        },
        plain: {
          dataType: 'string',
          fieldNumber: 2,
        },
      },
    },
    content: {
      dataType: 'string',
      fieldNumber: 19,
    },
    contentMime: {
      dataType: 'string',
      fieldNumber: 20,
    },
    contentExtension: {
      dataType: 'string',
      fieldNumber: 21,
    },
    contentSize: {
      dataType: 'uint32',
      fieldNumber: 22,
    },
    contentProtocol: {
      dataType: 'string',
      fieldNumber: 23,
    },
    contentSecurity: {
      dataType: 'string',
      fieldNumber: 24,
    },
    recurring: {
      dataType: 'string',
      fieldNumber: 25,
    },
    time: {
      fieldNumber: 26,
      ...scheduleTimeSchema,
    },
    from: {
      fieldNumber: 27,
      ...scheduleFromSchema,
    },
    until: {
      dataType: 'uint32',
      fieldNumber: 28,
    },
    redeemNonceLimit: {
      dataType: 'uint32',
      fieldNumber: 29,
    },
    redeemCountLimit: {
      dataType: 'uint32',
      fieldNumber: 30,
    },
    royalty: {
      fieldNumber: 31,
      ...royaltySchema,
    },
    price: {
      fieldNumber: 32,
      ...priceSchema,
    },
    quantity: {
      dataType: 'uint32',
      fieldNumber: 33,
    },
    mintingExpire: {
      dataType: 'uint32',
      fieldNumber: 34,
    },
    raffled: {
      dataType: 'sint32',
      fieldNumber: 35,
    },
  },
};
