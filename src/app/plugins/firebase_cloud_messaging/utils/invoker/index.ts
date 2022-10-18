import { BaseChannel } from 'lisk-framework';

export const invokeFCMSendToAddress = async (
  channel: BaseChannel,
  address: string,
  message: Record<string, unknown>,
): Promise<void> => channel.invoke('firebaseCloudMessaging:sendToAddress', { address, message });

export const invokeFCMIsReady = async (channel: BaseChannel): Promise<boolean> =>
  channel.invoke('firebaseCloudMessaging:isReady');

export const invokeFCMIsAddressRegistered = async (
  channel: BaseChannel,
  address: string,
): Promise<boolean> => channel.invoke('firebaseCloudMessaging:isAddressRegistered', { address });

export const invokeFCMIsTokenUpdated = async (
  channel: BaseChannel,
  address: string,
  token: string,
): Promise<boolean> => channel.invoke('firebaseCloudMessaging:isTokenUpdated', { address, token });

export const invokeFCMRegisterAddress = async (
  channel: BaseChannel,
  publicKey: string,
  token: string,
  signature: string,
): Promise<void> =>
  channel.invoke('firebaseCloudMessaging:registerAddress', { publicKey, token, signature });

export const invokeFCMRemoveAddress = async (
  channel: BaseChannel,
  address: string,
): Promise<void> => channel.invoke('firebaseCloudMessaging:removeAddress', { address });
