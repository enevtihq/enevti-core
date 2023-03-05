import { AddExclusiveCommentProps } from 'enevti-types/asset/nft_exclusive_comment/add_exclusive_comment_asset';
import { AddExclusiveCommentPayload } from 'enevti-types/param/nft_exclusive_comment';
import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { ADD_EXCLUSIVE_COMMENT_ASSET_NAME } from '../constants/codec';
import { ADD_EXCLUSIVE_COMMENT_ASSET_ID } from '../constants/id';
import { CID_MAX_LENGTH, IDENTIFIER_MAX_LENGTH, ID_MAX_LENGTH } from '../constants/limit';
import { addExclusiveCommentSchema } from '../schema/assets/add_exclusive_comment_asset';
import { addExclusiveComment } from '../utils/addExclusiveComment';

export class AddExclusiveCommentAsset extends BaseAsset {
  public name = ADD_EXCLUSIVE_COMMENT_ASSET_NAME;
  public id = ADD_EXCLUSIVE_COMMENT_ASSET_ID;
  public schema = addExclusiveCommentSchema;

  public validate({ asset }: ValidateAssetContext<AddExclusiveCommentProps>): void {
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
  }: ApplyAssetContext<AddExclusiveCommentProps>): Promise<void> {
    const payload: AddExclusiveCommentPayload = {
      id: transaction.id,
      cid: asset.cid,
      creator: transaction.senderAddress,
      identifier: asset.identifier,
      target: Buffer.from(asset.id, 'hex'),
    };
    await addExclusiveComment(stateStore, reducerHandler, payload);
  }
}
