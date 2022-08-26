import { BaseChannel } from 'lisk-framework';
import { invokeFCMIsAddressRegistered, invokeFCMSendToAddress } from './invoker/fcm';

export async function sendDataOnlyTopicMessaging(
  channel: BaseChannel,
  address: string,
  type: string,
  payload: Record<string, unknown>,
) {
  const isAddressRegistered = await invokeFCMIsAddressRegistered(channel, address);
  if (!isAddressRegistered) throw new Error('address is not registered on FCM plugin');
  const message = {
    data: {
      type,
      payload: JSON.stringify(payload),
    },
    android: { priority: 'high' },
    apns: {
      payload: {
        aps: {
          contentAvailable: true,
        },
      },
      headers: {
        'apns-push-type': 'background',
        'apns-priority': '5',
        'apns-topic': 'com.enevti.app',
      },
    },
  };
  await invokeFCMSendToAddress(channel, address, message);
}
