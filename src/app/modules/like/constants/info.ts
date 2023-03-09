import { ModuleInfo } from 'enevti-types/utils/moduleInfo';
import { ADD_LIKE_ASSET_ID, LIKE_MODULE_ID } from 'enevti-types/constant/id';
import { addLikeSchema } from '../schema/assets/add_like_assets';
import { ADD_LIKE_ASSET_NAME } from './codec';

export const likeModuleInfo: ModuleInfo = {
  id: LIKE_MODULE_ID,
  asset: {
    [ADD_LIKE_ASSET_NAME]: {
      id: ADD_LIKE_ASSET_ID,
      schema: addLikeSchema,
    },
  },
};
