import { BlockRegisrarAsset, RegistrarAsset } from 'enevti-types/chain/registrar';
import { BaseChannel } from 'lisk-framework';

export const invokeGetRegistrar = async (
  channel: BaseChannel,
  identifier: string,
  value: string,
): Promise<RegistrarAsset | undefined> =>
  channel.invoke('registrar:getRegistrar', { identifier, value });

export const invokeGetBlockRegistrar = async (
  channel: BaseChannel,
  height: number,
): Promise<BlockRegisrarAsset | undefined> => channel.invoke('registrar:getRegistrar', { height });
