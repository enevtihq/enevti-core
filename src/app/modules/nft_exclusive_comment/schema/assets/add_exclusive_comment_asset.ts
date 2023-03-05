import { AssetSchemaFromType } from 'enevti-types/utils/schema';
import { AddExclusiveCommentProps } from 'enevti-types/asset/nft_exclusive_comment/add_exclusive_comment_asset';
import { ADD_EXCLUSIVE_COMMENT_ASSET_NAME, EXCLUSIVE_COMMENT_PREFIX } from '../../constants/codec';

export const addExclusiveCommentSchema: AssetSchemaFromType<AddExclusiveCommentProps> = {
  $id: `enevti/${EXCLUSIVE_COMMENT_PREFIX}/${ADD_EXCLUSIVE_COMMENT_ASSET_NAME}`,
  title: `${ADD_EXCLUSIVE_COMMENT_ASSET_NAME}Asset transaction asset for ${EXCLUSIVE_COMMENT_PREFIX} module`,
  type: 'object',
  required: ['id', 'identifier', 'cid'],
  properties: {
    id: {
      dataType: 'string',
      fieldNumber: 1,
    },
    identifier: {
      dataType: 'string',
      fieldNumber: 2,
    },
    cid: {
      dataType: 'string',
      fieldNumber: 3,
    },
  },
};
