import { NewRegistrarEvent } from 'enevti-types/param/registrar';
import { AfterBlockApplyContext } from 'lisk-framework';
import { BaseModuleChannel } from 'lisk-framework/dist-node/modules';
import { REGISTRAR_PREFIX } from '../../constants/codec';
import { getBlockRegistrar } from '../../utils/block';

export default async function registrarAfterBlockApply(
  input: AfterBlockApplyContext,
  channel: BaseModuleChannel,
) {
  const blockRegistrar = await getBlockRegistrar(input.stateStore, input.block.header.height);
  if (blockRegistrar && blockRegistrar.items.length > 0) {
    for (const registrar of blockRegistrar.items) {
      const eventPayload: NewRegistrarEvent = {
        payload: `${registrar.name}:${registrar.payload}`,
      };
      channel.publish(`${REGISTRAR_PREFIX}:newRegistrar`, eventPayload);
    }
  }
}
