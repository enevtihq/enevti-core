import { BaseChannel } from 'lisk-framework';
import * as apn from 'apn';
import {
  invokeAPNIsAddressRegistered,
  invokeAPNSendToAddress,
} from '../../apple_push_notification_service/utils/invoker';
import {
  invokeFCMIsAddressRegistered,
  invokeFCMSendToAddress,
} from '../../firebase_cloud_messaging/utils/invoker';

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
      payload: { aps: { contentAvailable: true } },
      headers: {
        'apns-push-type': 'background',
        'apns-priority': '5',
        'apns-topic': 'com.enevti.app',
      },
    },
  };
  await invokeFCMSendToAddress(channel, address, message);
}

export async function sendDataNotificationToAddress(
  channel: BaseChannel,
  address: string,
  type: string,
  payload: Record<string, unknown>,
  title: string,
  body: string,
  badge?: number,
) {
  const isAddressRegistered = await invokeFCMIsAddressRegistered(channel, address);
  if (!isAddressRegistered) throw new Error('address is not registered on FCM plugin');
  const message = {
    notification: {
      title,
      body,
    },
    data: {
      type,
      payload: JSON.stringify(payload),
    },
    android: { priority: 'high' },
    apns: {
      payload: { aps: { contentAvailable: true, badge } },
      headers: {
        'apns-push-type': 'alert',
        'apns-priority': '10',
        'apns-topic': 'com.enevti.app',
      },
    },
  };
  await invokeFCMSendToAddress(channel, address, message);
}

export async function sendIOSVoipNotificationToAddress(
  channel: BaseChannel,
  address: string,
  payload: Record<string, unknown>,
) {
  const isAddressRegistered = await invokeAPNIsAddressRegistered(channel, address);
  if (!isAddressRegistered) throw new Error('address is not registered on APNs plugin');

  const note = new apn.Notification();
  note.payload = payload;
  note.aps['apns-push-type'] = 'voip';
  note.topic = 'com.enevti.app.voip';

  await invokeAPNSendToAddress(channel, address, note);
}
