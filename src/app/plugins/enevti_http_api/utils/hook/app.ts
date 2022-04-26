import { BaseChannel } from 'lisk-framework';

export const invokeGetNodeIndo = async (channel: BaseChannel): Promise<Record<string, unknown>> =>
  channel.invoke('app:getNodeInfo');

export const invokeGetSchema = async (channel: BaseChannel): Promise<Record<string, unknown>> =>
  channel.invoke('app:getSchema');
