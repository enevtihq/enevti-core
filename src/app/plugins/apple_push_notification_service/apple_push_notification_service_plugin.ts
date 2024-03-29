/* eslint-disable no-nested-ternary */
import * as dotenv from 'dotenv';
import { BasePlugin, cryptography, db, PluginInfo } from 'lisk-sdk';
import type { BaseChannel, EventsDefinition, ActionsDefinition, SchemaWithDefault } from 'lisk-sdk';
import * as apn from 'apn';
import * as path from 'path';
import * as fs from 'fs';
import {
  getTokenByAddress,
  isAddressRegistered,
  registerAddress,
  removeAddress,
} from './utils/actions';
import { getDBInstance } from './utils/db';
import { APNConfig, applePushNotificationServiceSchema } from './schema/config';

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
dotenv.config();

/* eslint-disable class-methods-use-this */
/* eslint-disable  @typescript-eslint/no-empty-function */
export class ApplePushNotificationServicePlugin extends BasePlugin {
  private _channel: BaseChannel | undefined = undefined;
  private _provider: apn.Provider | undefined = undefined;
  private _db: db.KVStore | undefined = undefined;

  public static get alias(): string {
    return 'applePushNotificationService';
  }

  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
  public static get info(): PluginInfo {
    return {
      author: 'enevtihq',
      version: '0.1.0',
      name: 'applePushNotificationService',
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  public get defaults(): SchemaWithDefault {
    return applePushNotificationServiceSchema;
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
        if (this._provider === undefined || this._db === undefined) {
          throw new Error('APN provider is not configured!');
        }
        const { address, notification } = params as {
          address: string;
          notification: apn.Notification;
        };
        const token = await getTokenByAddress(this._db, address);
        if (token) {
          await this._provider.send(notification, token);
        }
      },
      // eslint-disable-next-line @typescript-eslint/require-await
      isReady: async () => this._provider !== undefined,
      isTokenUpdated: async params => {
        if (this._provider === undefined || this._db === undefined) {
          throw new Error('APN provider is not configured!');
        }
        const { token, address } = params as { token: string; address: string };
        const tokenInDb = await getTokenByAddress(this._db, address);
        return token === tokenInDb;
      },
      isAddressRegistered: async params => {
        if (this._provider === undefined || this._db === undefined) {
          throw new Error('APN provider is not configured!');
        }
        const { address } = params as { address: string };
        return isAddressRegistered(this._db, address);
      },
      registerAddress: async params => {
        if (this._provider === undefined || this._db === undefined || this._channel === undefined) {
          throw new Error('APN provider is not configured!');
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
        if (this._provider === undefined || this._db === undefined) {
          throw new Error('APN provider is not configured!');
        }
        const { address } = params as { address: string };
        await removeAddress(this._db, address);
      },
    };
  }

  public async load(channel: BaseChannel): Promise<void> {
    this._channel = channel;
    const apnConfig = (this.options as unknown) as APNConfig;
    const apnKeyFileName = process.env.APN_KEY_FILE_NAME
      ? process.env.APN_KEY_FILE_NAME
      : apnConfig.apnKeyFileName
      ? apnConfig.apnKeyFileName
      : 'apn.p8';
    const apnAuthKeyPath = path.join(__dirname, `./${apnKeyFileName}`);
    const apnConfigured = fs.existsSync(apnAuthKeyPath);
    if (apnConfigured) {
      const keyId = process.env.APN_KEY_ID
        ? process.env.APN_KEY_ID
        : apnConfig.apnKeyId
        ? apnConfig.apnKeyId
        : undefined;
      const teamId = process.env.APN_TEAM_ID
        ? process.env.APN_TEAM_ID
        : apnConfig.apnTeamId
        ? apnConfig.apnTeamId
        : undefined;
      const production = process.env.APN_IS_PRODUCTION
        ? process.env.APN_IS_PRODUCTION
        : apnConfig.apnIsProduction
        ? apnConfig.apnIsProduction
        : 'true';
      if (!keyId || !teamId) {
        this._logger.warn(
          `please configure APN_KEY_ID and APN_TEAM_ID in your .env file, or set apnKeyId and apnTeamId in your config file`,
        );
      } else {
        const options = {
          token: {
            key: apnAuthKeyPath,
            keyId,
            teamId,
          },
          production: production === 'true',
        };
        this._provider = new apn.Provider(options);
        this._db = await getDBInstance();
        this._logger.info('APNs is successfully initialized');
      }
    } else {
      this._logger.warn(
        `please put ${apnKeyFileName} on the apple_push_notification_service plugin root directory`,
      );
    }
  }

  public async unload(): Promise<void> {
    if (this._provider) {
      this._provider.shutdown();
    }
    await this._db?.close();
  }
}
