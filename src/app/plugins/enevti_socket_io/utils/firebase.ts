import * as admin from 'firebase-admin';

export async function sendDataOnlyTopicMessaging(topic: string, type: string, payload: string) {
  await admin.messaging().send({
    topic,
    data: {
      type,
      payload,
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
  });
}
