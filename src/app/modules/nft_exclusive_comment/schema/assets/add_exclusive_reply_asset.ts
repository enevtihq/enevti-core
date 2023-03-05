import { AssetSchemaFromType } from 'enevti-types/utils/schema';
import { AddExclusiveReplyProps } from 'enevti-types/asset/nft_exclusive_comment/add_exclusive_reply_asset';
import { ADD_EXCLUSIVE_REPLY_ASSET_NAME, EXCLUSIVE_COMMENT_PREFIX } from '../../constants/codec';

export const addExclusiveReplySchema: AssetSchemaFromType<AddExclusiveReplyProps> = {
  $id: `enevti/${EXCLUSIVE_COMMENT_PREFIX}/${ADD_EXCLUSIVE_REPLY_ASSET_NAME}`,
  title: `${ADD_EXCLUSIVE_REPLY_ASSET_NAME}Asset transaction asset for ${EXCLUSIVE_COMMENT_PREFIX} module`,
  type: 'object',
  required: ['id', 'cid'],
  properties: {
    id: {
      dataType: 'string',
      fieldNumber: 1,
    },
    cid: {
      dataType: 'string',
      fieldNumber: 2,
    },
  },
};
