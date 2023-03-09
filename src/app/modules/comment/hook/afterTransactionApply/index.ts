import { NewCommentEvent } from 'enevti-types/param/comment';
import { TransactionApplyContext } from 'lisk-framework';
import { BaseModuleChannel } from 'lisk-framework/dist-node/modules';
import { ADD_COMMENT_ASSET_ID, COMMENT_MODULE_ID } from 'enevti-types/constant/id';
import { COMMENT_PREFIX } from '../../constants/codec';

export default function commentAfterTransactionApply(
  input: TransactionApplyContext,
  channel: BaseModuleChannel,
) {
  const { moduleID, assetID, id } = input.transaction;
  if (moduleID === COMMENT_MODULE_ID && assetID === ADD_COMMENT_ASSET_ID) {
    const eventPayload: NewCommentEvent = { id };
    channel.publish(`${COMMENT_PREFIX}:newComment`, eventPayload);
  }
}
