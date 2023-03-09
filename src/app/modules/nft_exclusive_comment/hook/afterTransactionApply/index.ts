import {
  NewExclusiveCommentEvent,
  NewExclusiveReplyEvent,
} from 'enevti-types/param/nft_exclusive_comment';
import { TransactionApplyContext } from 'lisk-framework';
import { BaseModuleChannel } from 'lisk-framework/dist-node/modules';
import {
  ADD_EXCLUSIVE_COMMENT_ASSET_ID,
  ADD_EXCLUSIVE_REPLY_ASSET_ID,
  EXCLUSIVE_COMMENT_MODULE_ID,
} from 'enevti-types/constant/id';
import { EXCLUSIVE_COMMENT_PREFIX } from '../../constants/codec';

export default function exclusiveCommentAfterTransactionApply(
  input: TransactionApplyContext,
  channel: BaseModuleChannel,
) {
  const { moduleID, assetID, id } = input.transaction;
  if (moduleID === EXCLUSIVE_COMMENT_MODULE_ID && assetID === ADD_EXCLUSIVE_COMMENT_ASSET_ID) {
    const eventPayload: NewExclusiveCommentEvent = { id };
    channel.publish(`${EXCLUSIVE_COMMENT_PREFIX}:newExclusiveComment`, eventPayload);
  }
  if (moduleID === EXCLUSIVE_COMMENT_MODULE_ID && assetID === ADD_EXCLUSIVE_REPLY_ASSET_ID) {
    const eventPayload: NewExclusiveReplyEvent = { id };
    channel.publish(`${EXCLUSIVE_COMMENT_PREFIX}:newExclusiveReply`, eventPayload);
  }
}
