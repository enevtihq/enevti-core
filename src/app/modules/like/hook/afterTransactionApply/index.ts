import { TransactionApplyContext } from 'lisk-framework';
import { AddLikeProps } from 'enevti-types/asset/like/add_like_asset';
import { NewLikeEvent } from 'enevti-types/param/like';
import { BaseModuleChannel } from 'lisk-framework/dist-node/modules';
import { codec } from 'lisk-sdk';
import { ADD_LIKE_ASSET_ID, LIKE_MODULE_ID } from 'enevti-types/constant/id';
import { LIKE_PREFIX } from '../../constants/codec';
import { addLikeSchema } from '../../schema/assets/add_like_assets';

export default function activityAfterTransactionApply(
  input: TransactionApplyContext,
  channel: BaseModuleChannel,
) {
  const { senderAddress, moduleID, assetID } = input.transaction;
  if (moduleID === LIKE_MODULE_ID && assetID === ADD_LIKE_ASSET_ID) {
    const { identifier, id } = codec.decode<AddLikeProps>(addLikeSchema, input.transaction.asset);
    const eventPayload: NewLikeEvent = { identifier, id, senderAddress };
    channel.publish(`${LIKE_PREFIX}:newLike`, eventPayload);
  }
}
