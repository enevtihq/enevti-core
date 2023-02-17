import { AfterBlockApplyContext } from 'lisk-framework';
import { BaseModuleChannel } from 'lisk-framework/dist-node/modules';
import { ACTIVITY_PREFIX } from '../../constants/codec';
import { getActivities } from '../../utils/list';

export default async function activityAfterBlockApply(
  input: AfterBlockApplyContext,
  channel: BaseModuleChannel,
) {
  const blockActivities = await getActivities(
    input.stateStore,
    'block',
    input.block.header.height.toString(),
  );
  if (blockActivities && blockActivities.items.length > 0) {
    channel.publish(`${ACTIVITY_PREFIX}:blockWithNewActivity`, {
      height: input.block.header.height,
    });
  }

  for (const payload of input.block.payload) {
    const transactionActivities = await getActivities(
      input.stateStore,
      'transaction',
      payload.id.toString('hex'),
    );
    if (transactionActivities && transactionActivities.items.length > 0) {
      for (const id of transactionActivities.items) {
        channel.publish(`${ACTIVITY_PREFIX}:newActivity`, { id });
      }
    }
  }
}
