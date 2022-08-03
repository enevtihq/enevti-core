import { BaseChannel } from 'lisk-framework';

export const invokeGetNodeIndo = async (channel: BaseChannel): Promise<Record<string, unknown>> =>
  channel.invoke('app:getNodeInfo');

export const invokeGetSchema = async (channel: BaseChannel): Promise<Record<string, unknown>> =>
  channel.invoke('app:getSchema');

export const invokePostTransaction = async (
  channel: BaseChannel,
  transaction: string,
): Promise<Record<string, string>> =>
  channel.invoke('app:postTransaction', {
    transaction,
  });

export const invokeGetTransactionsFromPool = async (channel: BaseChannel): Promise<string[]> =>
  channel.invoke('app:getTransactionsFromPool');

export const invokeGetTransactionById = async (
  channel: BaseChannel,
  id: string,
): Promise<string | undefined> => {
  try {
    const ret = await channel.invoke('app:getTransactionByID', {
      id,
    });
    return ret as string;
  } catch {
    return undefined;
  }
};
