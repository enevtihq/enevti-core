import { TransactionApplyContext } from 'lisk-framework';
import { BaseModuleChannel } from 'lisk-framework/dist-node/modules';
import { COMMENT_PREFIX } from '../../constants/codec';
import { ADD_COMMENT_ASSET_ID, COMMENT_MODULE_ID } from '../../constants/id';

export default function commentAfterTransactionApply(
  input: TransactionApplyContext,
  channel: BaseModuleChannel,
) {
  const { moduleID, assetID, id } = input.transaction;
  if (moduleID === COMMENT_MODULE_ID && assetID === ADD_COMMENT_ASSET_ID) {
    channel.publish(`${COMMENT_PREFIX}:newComment`, {
      id,
    });
  }
}
