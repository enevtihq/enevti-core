import { BasePlugin, PluginInfo } from 'lisk-sdk';
import type { BaseChannel, EventsDefinition, ActionsDefinition, SchemaWithDefault } from 'lisk-sdk';
import * as http from 'http';
import * as express from 'express';
import { Server } from 'socket.io';
import { callHandler, TwilioConfig } from './controller';
import { enevtiCallSocketSchema } from './schema/config';

/* eslint-disable class-methods-use-this */
/* eslint-disable  @typescript-eslint/no-empty-function */
export class EnevtiCallSocketPlugin extends BasePlugin {
  private _server: http.Server | undefined = undefined;
  private _app: express.Express | undefined = undefined;
  private _io: Server | undefined = undefined;
  private _channel: BaseChannel | undefined = undefined;
  private _twilioConfig: TwilioConfig | undefined = undefined;

  public static get alias(): string {
    return 'enevtiCallSocket';
  }

  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
  public static get info(): PluginInfo {
    return {
      author: 'enevtihq',
      version: '0.1.0',
      name: 'enevtiCallSocket',
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  public get defaults(): SchemaWithDefault {
    return enevtiCallSocketSchema;
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
    if (
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_API_KEY_SID &&
      process.env.TWILIO_API_KEY_SECRET
    ) {
      this._twilioConfig = {
        twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
        twilioApiKeySid: process.env.TWILIO_API_KEY_SID,
        twilioApiKeySecret: process.env.TWILIO_API_KEY_SECRET,
      };
    } else if (
      this.options.twilioAccountSid &&
      this.options.twilioApiKeySid &&
      this.options.twilioApiKeySecret
    ) {
      const { twilioAccountSid, twilioApiKeySid, twilioApiKeySecret } = (this
        .options as unknown) as TwilioConfig;
      this._twilioConfig = { twilioAccountSid, twilioApiKeySecret, twilioApiKeySid };
    } else {
      throw new Error('Twilio is not configured, Enevti Call Soket Plugin cannot be started!');
    }
    this._app = express();
    this._channel = channel;
    this._server = http.createServer(this._app);
    this._io = new Server(this._server);

    callHandler(this._channel, this._io, this._twilioConfig);

    this._server.listen(8083);
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
