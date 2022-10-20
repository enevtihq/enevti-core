import { BaseChannel } from 'lisk-framework';
import * as apn from 'apn';

export const invokeAPNSendToAddress = async (
  channel: BaseChannel,
  address: string,
  notification: apn.Notification,
): Promise<void> =>
  channel.invoke('applePushNotificationService:sendToAddress', { address, notification });

export const invokeAPNIsReady = async (channel: BaseChannel): Promise<boolean> =>
  channel.invoke('applePushNotificationService:isReady');

export const invokeAPNIsAddressRegistered = async (
  channel: BaseChannel,
  address: string,
): Promise<boolean> =>
  channel.invoke('applePushNotificationService:isAddressRegistered', { address });

export const invokeAPNIsTokenUpdated = async (
  channel: BaseChannel,
  address: string,
  token: string,
): Promise<boolean> =>
  channel.invoke('applePushNotificationService:isTokenUpdated', { address, token });

export const invokeAPNRegisterAddress = async (
  channel: BaseChannel,
  publicKey: string,
  token: string,
  signature: string,
): Promise<void> =>
  channel.invoke('applePushNotificationService:registerAddress', { publicKey, token, signature });

export const invokeAPNRemoveAddress = async (
  channel: BaseChannel,
  address: string,
): Promise<void> => channel.invoke('applePushNotificationService:removeAddress', { address });
