/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'lisk-sdk';
import { ApplePushNotificationServicePlugin } from "./plugins/apple_push_notification_service/apple_push_notification_service_plugin";
import { EnevtiCallSocketPlugin } from "./plugins/enevti_call_socket/enevti_call_socket_plugin";
import { EnevtiFaucetApiPlugin } from './plugins/enevti_faucet_api/enevti_faucet_api_plugin';
import { EnevtiHttpApiPlugin } from './plugins/enevti_http_api/enevti_http_api_plugin';
import { EnevtiSocketIoPlugin } from "./plugins/enevti_socket_io/enevti_socket_io_plugin";
import { EnevtiUserMetaPlugin } from "./plugins/enevti_user_meta/enevti_user_meta_plugin";
import { FirebaseCloudMessagingPlugin } from "./plugins/firebase_cloud_messaging/firebase_cloud_messaging_plugin";

export const registerPlugins = (app: Application): void => {
    app.registerPlugin(EnevtiHttpApiPlugin);
    app.registerPlugin(EnevtiFaucetApiPlugin);
    app.registerPlugin(EnevtiSocketIoPlugin);
    app.registerPlugin(FirebaseCloudMessagingPlugin);
    app.registerPlugin(EnevtiCallSocketPlugin);
    app.registerPlugin(ApplePushNotificationServicePlugin);
    app.registerPlugin(EnevtiUserMetaPlugin);
};
