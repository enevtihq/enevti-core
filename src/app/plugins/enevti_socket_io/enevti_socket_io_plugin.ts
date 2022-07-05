import { BasePlugin, PluginInfo } from 'lisk-sdk';
import type { BaseChannel, EventsDefinition, ActionsDefinition, SchemaWithDefault } from 'lisk-sdk';
import * as http from 'http';
import * as express from 'express';
import { Server } from 'socket.io';
import * as fs from 'fs';
import * as admin from 'firebase-admin';
import * as path from 'path';
import { createEnevtiSocket, registerAccountSocket } from './controller';

/* eslint-disable class-methods-use-this */
/* eslint-disable  @typescript-eslint/no-empty-function */
export class EnevtiSocketIoPlugin extends BasePlugin {
  private _server: http.Server | undefined = undefined;
  private _app: express.Express | undefined = undefined;
  private _io: Server | undefined = undefined;
  private _channel: BaseChannel | undefined = undefined;
  private _admin: typeof admin | undefined = undefined;

  public static get alias(): string {
    return 'enevtiSocketIo';
  }

  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
  public static get info(): PluginInfo {
    return {
      author: 'enevtihq',
      version: '0.1.0',
      name: 'enevtiSocketIo',
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  public get defaults(): SchemaWithDefault {
    return {
      $id: '/plugins/plugin-enevtiSocketIo/config',
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
    const firebaseConfigPath = path.join(__dirname, './service/firebase.json');
    const firebaseConfigured = fs.existsSync(firebaseConfigPath);
    if (firebaseConfigured) {
      // eslint-disable-next-line
      const serviceAccount = require(firebaseConfigPath);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      this._admin = admin;
      this._logger.info('firebase is successfully initialized');
    } else {
      this._logger.warn('firebase is not configured, some features may not work');
      this._logger.warn('please put firebase.json on this plugin service directory');
    }

    this._app = express();
    this._channel = channel;
    this._server = http.createServer(this._app);
    this._io = new Server(this._server);

    registerAccountSocket(this._io);
    createEnevtiSocket(this._channel, this._io, this._admin);

    this._server.listen(8082);
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
