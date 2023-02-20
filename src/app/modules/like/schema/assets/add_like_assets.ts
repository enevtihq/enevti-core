import { AssetSchemaFromType } from 'enevti-types/utils/schema';
import { AddLikeProps } from 'enevti-types/asset/like/add_like_asset';
import { ADD_LIKE_ASSET_NAME, LIKE_MODULE_PREFIX } from '../../constants/codec';

export const addLikeSchema: AssetSchemaFromType<AddLikeProps> = {
  $id: `enevti/${LIKE_MODULE_PREFIX}/${ADD_LIKE_ASSET_NAME}`,
  title: `${ADD_LIKE_ASSET_NAME}Asset transaction asset for ${LIKE_MODULE_PREFIX} module`,
  type: 'object',
  required: ['identifier', 'id'],
  properties: {
    identifier: {
      dataType: 'string',
      fieldNumber: 1,
    },
    id: {
      dataType: 'string',
      fieldNumber: 2,
    },
  },
};
