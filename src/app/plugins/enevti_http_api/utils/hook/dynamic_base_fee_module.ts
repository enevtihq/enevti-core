import { BaseChannel } from 'lisk-framework';

export const invokeGetDynamicBaseFeePerByte = async (
  channel: BaseChannel,
  transaction: { moduleID: number; assetID: number },
): Promise<number> => channel.invoke('dynamicBaseFee:getDynamicBaseFeePerByte', { transaction });

export const invokeGetBaseFee = async (
  channel: BaseChannel,
  transaction: { moduleID: number; assetID: number },
): Promise<bigint> => channel.invoke('dynamicBaseFee:getBaseFee', { transaction });
