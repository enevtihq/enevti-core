import { BasePlugin, cryptography, db, PluginInfo } from 'lisk-sdk';
import type { BaseChannel, EventsDefinition, ActionsDefinition, SchemaWithDefault } from 'lisk-sdk';
import * as fs from 'fs';
import * as admin from 'firebase-admin';
import * as path from 'path';
import { Message } from 'firebase-admin/lib/messaging/messaging-api';
import {
  getTokenByAddress,
  isAddressRegistered,
  registerAddress,
  removeAddress,
} from './utils/actions';
import { getDBInstance } from './utils/db';

/* eslint-disable class-methods-use-this */
/* eslint-disable  @typescript-eslint/no-empty-function */
export class FirebaseCloudMessagingPlugin extends BasePlugin {
  private _channel: BaseChannel | undefined = undefined;
  private _admin: typeof admin | undefined = undefined;
  private _db: db.KVStore | undefined = undefined;

  public static get alias(): string {
    return 'firebaseCloudMessaging';
  }

  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
  public static get info(): PluginInfo {
    return {
      author: 'enevtihq',
      version: '0.1.0',
      name: 'firebaseCloudMessaging',
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  public get defaults(): SchemaWithDefault {
    return {
      $id: '/plugins/plugin-firebaseCloudMessaging/config',
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
      sendToAddress: async params => {
        if (this._admin === undefined || this._db === undefined) {
          throw new Error('firebase is not configured!');
        }
        const { address, message } = params as { address: string; message: Message };
        const token = await getTokenByAddress(this._db, address);
        if (token) {
          await this._admin.messaging().send({ ...message, token });
        }
      },
      // eslint-disable-next-line @typescript-eslint/require-await
      isReady: async () => this._admin !== undefined,
      isTokenUpdated: async params => {
        if (this._admin === undefined || this._db === undefined) {
          throw new Error('firebase is not configured!');
        }
        const { token, address } = params as { token: string; address: string };
        const tokenInDb = await getTokenByAddress(this._db, address);
        return token === tokenInDb;
      },
      isAddressRegistered: async params => {
        if (this._admin === undefined || this._db === undefined) {
          throw new Error('firebase is not configured!');
        }
        const { address } = params as { address: string };
        return isAddressRegistered(this._db, address);
      },
      registerAddress: async params => {
        if (this._admin === undefined || this._db === undefined || this._channel === undefined) {
          throw new Error('firebase is not configured!');
        }
        const { publicKey, token, signature } = params as {
          publicKey: string;
          token: string;
          signature: string;
        };

        if (
          !cryptography.verifyData(
            cryptography.stringToBuffer(token),
            Buffer.from(signature, 'hex'),
            Buffer.from(publicKey, 'hex'),
          )
        ) {
          throw new Error(`registerAddress failed because of invalid signature`);
        }

        const address = cryptography
          .getAddressFromPublicKey(Buffer.from(publicKey, 'hex'))
          .toString('hex');
        await registerAddress(this._db, address, token);
      },
      removeAddress: async params => {
        if (this._admin === undefined || this._db === undefined) {
          throw new Error('firebase is not configured!');
        }
        const { address } = params as { address: string };
        await removeAddress(this._db, address);
      },
    };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async load(channel: BaseChannel): Promise<void> {
    this._channel = channel;
    const firebaseConfigPath = path.join(__dirname, './firebase.json');
    const firebaseConfigured = fs.existsSync(firebaseConfigPath);
    if (firebaseConfigured) {
      // eslint-disable-next-line
      const serviceAccount = require(firebaseConfigPath);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      this._admin = admin;
      this._db = await getDBInstance();
      this._logger.info('firebase is successfully initialized');
    } else {
      this._logger.warn(
        'please put firebase.json on the firebase_cloud_messaging plugin root directory',
      );
    }
  }

  public async unload(): Promise<void> {
    await this._db?.close();
  }
}
