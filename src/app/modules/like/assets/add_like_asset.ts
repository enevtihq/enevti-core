import { AddLikeProps } from 'enevti-types/asset/like/add_like_asset';
import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { ADD_LIKE_ASSET_NAME, LIKE_MODULE_PREFIX } from '../constants/codec';
import { ADD_LIKE_ASSET_ID } from '../constants/id';
import { IDENTIFIER_MAX_LENGTH, ID_MAX_LENGTH } from '../constants/limit';
import { addLikeSchema } from '../schema/assets/add_like_assets';

export class AddLikeAsset extends BaseAsset {
  public name = ADD_LIKE_ASSET_NAME;
  public id = ADD_LIKE_ASSET_ID;
  public schema = addLikeSchema;

  public validate({ asset }: ValidateAssetContext<AddLikeProps>): void {
    if (asset.identifier.length > IDENTIFIER_MAX_LENGTH) {
      throw new Error(`maximum identifier length is ${IDENTIFIER_MAX_LENGTH}`);
    }
    if (asset.id.length > ID_MAX_LENGTH) {
      throw new Error(`maximum id length is ${ID_MAX_LENGTH}`);
    }
  }

  public async apply({
    asset,
    transaction,
    reducerHandler,
  }: ApplyAssetContext<AddLikeProps>): Promise<void> {
    await reducerHandler.invoke(`${LIKE_MODULE_PREFIX}:addLike`, {
      reducerHandler,
      identifier: asset.identifier,
      target: asset.id,
      senderAddress: transaction.senderAddress,
    });
  }
}
