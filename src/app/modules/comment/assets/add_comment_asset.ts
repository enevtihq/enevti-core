import { AddCommentProps } from 'enevti-types/asset/comment/add_comment_asset';
import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { ADD_COMMENT_ASSET_NAME } from '../constants/codec';
import { ADD_COMMENT_ASSET_ID } from '../constants/id';
import { CID_MAX_LENGTH, IDENTIFIER_MAX_LENGTH, ID_MAX_LENGTH } from '../constants/limit';
import { addCommentSchema } from '../schema/assets/add_comment_assets';
import { addComment, AddCommentPayload } from '../utils/add';

export class AddCommentAsset extends BaseAsset {
  public name = ADD_COMMENT_ASSET_NAME;
  public id = ADD_COMMENT_ASSET_ID;
  public schema = addCommentSchema;

  public validate({ asset }: ValidateAssetContext<AddCommentProps>): void {
    if (asset.id.length > ID_MAX_LENGTH) {
      throw new Error(`maximum id length is ${ID_MAX_LENGTH}`);
    }
    if (asset.identifier.length > IDENTIFIER_MAX_LENGTH) {
      throw new Error(`maximum identifier length is ${IDENTIFIER_MAX_LENGTH}`);
    }
    if (asset.cid.length > CID_MAX_LENGTH) {
      throw new Error(`maximum cid length is ${CID_MAX_LENGTH}`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async apply({
    asset,
    transaction,
    reducerHandler,
    stateStore,
  }: ApplyAssetContext<AddCommentProps>): Promise<void> {
    const payload: AddCommentPayload = {
      id: transaction.id,
      cid: asset.cid,
      creator: transaction.senderAddress,
      identifier: asset.identifier,
      target: Buffer.from(asset.id, 'hex'),
    };
    await addComment(stateStore, reducerHandler, payload);
  }
}
