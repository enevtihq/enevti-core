import { AddExclusiveReplyProps } from 'enevti-types/asset/nft_exclusive_comment/add_exclusive_reply_asset';
import { AddExclusiveReplyPayload } from 'enevti-types/param/nft_exclusive_comment';
import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { ADD_EXCLUSIVE_REPLY_ASSET_NAME } from '../constants/codec';
import { ADD_EXCLUSIVE_REPLY_ASSET_ID } from '../constants/id';
import { CID_MAX_LENGTH, ID_MAX_LENGTH } from '../constants/limit';
import { addExclusiveReplySchema } from '../schema/assets/add_exclusive_reply_asset';
import { addExclusiveReply } from '../utils/addExclusiveReply';

export class AddExclusiveReplyAsset extends BaseAsset {
  public name = ADD_EXCLUSIVE_REPLY_ASSET_NAME;
  public id = ADD_EXCLUSIVE_REPLY_ASSET_ID;
  public schema = addExclusiveReplySchema;

  public validate({ asset }: ValidateAssetContext<AddExclusiveReplyProps>): void {
    if (asset.id.length > ID_MAX_LENGTH) {
      throw new Error(`maximum id length is ${ID_MAX_LENGTH}`);
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
  }: ApplyAssetContext<AddExclusiveReplyProps>): Promise<void> {
    const payload: AddExclusiveReplyPayload = {
      id: transaction.id,
      cid: asset.cid,
      creator: transaction.senderAddress,
      target: Buffer.from(asset.id, 'hex'),
    };
    await addExclusiveReply(stateStore, reducerHandler, payload);
  }
}
