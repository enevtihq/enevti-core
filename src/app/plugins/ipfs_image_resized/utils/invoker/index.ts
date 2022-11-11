import { BaseChannel } from 'lisk-framework';

export const invokeIsIpfsResized = async (channel: BaseChannel, hash: string): Promise<boolean> =>
  channel.invoke('ipfsImageResized:isIpfsResized', { hash });

export const invokeGetIpfsResizedUri = async (
  channel: BaseChannel,
  hash: string,
  size: string,
): Promise<string | undefined> =>
  channel.invoke('ipfsImageResized:getIpfsResizedUri', { hash, size });

export const invokeStoreResizedImage = async (
  channel: BaseChannel,
  hash: string,
): Promise<boolean> => channel.invoke('ipfsImageResized:storeResizedImage', { hash });
