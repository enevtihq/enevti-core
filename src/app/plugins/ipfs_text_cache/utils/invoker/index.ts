import { BaseChannel } from 'lisk-framework';

export const invokeGetIPFSTextCache = async (
  channel: BaseChannel,
  hash: string,
): Promise<string | undefined> => channel.invoke('ipfsTextCache:getIPFSTextCache', { hash });

export const invokeSetIPFSTextCache = async (
  channel: BaseChannel,
  hash: string,
  text: string,
): Promise<void> => channel.invoke('ipfsTextCache:setIPFSTextCache', { hash, text });
