/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'lisk-sdk';
import { EnevtiFaucetApiPlugin } from './plugins/enevti_faucet_api/enevti_faucet_api_plugin';
import { EnevtiHttpApiPlugin } from './plugins/enevti_http_api/enevti_http_api_plugin';
import { EnevtiSocketIoPlugin } from "./plugins/enevti_socket_io/enevti_socket_io_plugin";

export const registerPlugins = (app: Application): void => {
    app.registerPlugin(EnevtiHttpApiPlugin);
    app.registerPlugin(EnevtiFaucetApiPlugin);
    app.registerPlugin(EnevtiSocketIoPlugin);
};
