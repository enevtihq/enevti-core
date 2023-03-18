import { ServeRateChain } from 'enevti-types/chain/redeemable_nft';
import { ArraySchema, BaseSchemaFromType, StateSchemaFromType } from 'enevti-types/utils/schema';

export const serveRateSchema: StateSchemaFromType<
  ServeRateChain,
  { items: ArraySchema<BaseSchemaFromType<ServeRateChain['items'][0]>> }
> = {
  $id: 'enevti/redeemableNft/serveRate',
  type: 'object',
  required: ['score', 'items'],
  properties: {
    score: {
      fieldNumber: 1,
      dataType: 'uint32',
    },
    items: {
      type: 'array',
      fieldNumber: 2,
      items: {
        type: 'object',
        required: ['id', 'nonce', 'owner', 'status'],
        properties: {
          id: {
            fieldNumber: 1,
            dataType: 'bytes',
          },
          nonce: {
            fieldNumber: 2,
            dataType: 'uint32',
          },
          owner: {
            fieldNumber: 3,
            dataType: 'bytes',
          },
          status: {
            fieldNumber: 4,
            dataType: 'uint32',
          },
        },
      },
    },
  },
};
