/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'lisk-sdk';
import { EnevtiHttpApiPlugin } from './plugins/enevti_http_api/enevti_http_api_plugin';

export const registerPlugins = (app: Application): void => {
  app.registerPlugin(EnevtiHttpApiPlugin);
};
