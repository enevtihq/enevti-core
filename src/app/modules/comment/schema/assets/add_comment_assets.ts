import { AssetSchemaFromType } from 'enevti-types/utils/schema';
import { AddCommentProps } from 'enevti-types/asset/comment/add_comment_asset';
import { ADD_COMMENT_ASSET_NAME, COMMENT_PREFIX } from '../../constants/codec';

export const addCommentSchema: AssetSchemaFromType<AddCommentProps> = {
  $id: `enevti/${COMMENT_PREFIX}/${ADD_COMMENT_ASSET_NAME}`,
  title: `${ADD_COMMENT_ASSET_NAME}Asset transaction asset for ${COMMENT_PREFIX} module`,
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
      fieldNumber: 2,
    },
  },
};
