/* eslint-disable @typescript-eslint/no-misused-promises */
import { BasePlugin, PluginInfo } from 'lisk-sdk';
import type { BaseChannel, EventsDefinition, ActionsDefinition, SchemaWithDefault } from 'lisk-sdk';
import { Server } from 'http';
import * as express from 'express';
import * as cors from 'cors';
import controller from './controller';

/* eslint-disable class-methods-use-this */
/* eslint-disable  @typescript-eslint/no-empty-function */
export class EnevtiFaucetApiPlugin extends BasePlugin {
  private _server: Server | undefined = undefined;
  private _app: express.Express | undefined = undefined;
  private _channel: BaseChannel | undefined = undefined;

  public static get alias(): string {
    return 'enevtiFaucetApi';
  }

  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
  public static get info(): PluginInfo {
    return {
      author: 'enevtihq',
      version: '0.1.0',
      name: 'enevtiFaucetApi',
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  public get defaults(): SchemaWithDefault {
    return {
      $id: '/plugins/plugin-enevtiFaucetApi/config',
      type: 'object',
      properties: {},
      required: [],
      default: {},
    };
  }

  public get events(): EventsDefinition {
    return [
      // 'block:created',
      // 'block:missed'
    ];
  }

  public get actions(): ActionsDefinition {
    return {
      // 	hello: async () => { hello: 'world' },
    };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async load(channel: BaseChannel): Promise<void> {
    try {
      this._app = express();
      this._channel = channel;

      this._app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT'] }));
      this._app.use(express.json());

      this._app.post('/faucet', controller.fundToken(this._channel));
      this._app.patch('/faucet/authorize', controller.authorizeFaucet(this._channel));

      this._server = this._app.listen(8881, '0.0.0.0');
    } catch (err) {
      this._logger.info('Faucet is disabled');
    }
  }

  public async unload(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      if (this._server) {
        this._server.close((err: unknown) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      }
    });
  }
}
