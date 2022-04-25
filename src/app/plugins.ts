/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'lisk-sdk';
import { EnevtiFaucetApiPlugin } from './plugins/enevti_faucet_api/enevti_faucet_api_plugin';
import { EnevtiHttpApiPlugin } from './plugins/enevti_http_api/enevti_http_api_plugin';

export const registerPlugins = (app: Application): void => {
  app.registerPlugin(EnevtiHttpApiPlugin);
  app.registerPlugin(EnevtiFaucetApiPlugin);
};
