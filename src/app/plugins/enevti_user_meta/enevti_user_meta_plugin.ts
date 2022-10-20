import { BasePlugin, cryptography, db, PluginInfo } from 'lisk-sdk';
import type { BaseChannel, EventsDefinition, ActionsDefinition, SchemaWithDefault } from 'lisk-sdk';
import { EnevtiUserMeta } from './schema/enevtiUserMetaSchema';
import { getEnevtiUserMeta, setEnevtiUserMeta } from './utils/actions';
import { getDBInstance } from './utils/db';
import { shallowCompare } from './utils/object';

/* eslint-disable class-methods-use-this */
/* eslint-disable  @typescript-eslint/no-empty-function */
export class EnevtiUserMetaPlugin extends BasePlugin {
  // private _channel!: BaseChannel;
  private _db: db.KVStore | undefined = undefined;

  public static get alias(): string {
    return 'enevtiUserMeta';
  }

  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
  public static get info(): PluginInfo {
    return {
      author: 'enevtihq',
      version: '0.1.0',
      name: 'enevtiUserMeta',
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  public get defaults(): SchemaWithDefault {
    return {
      $id: '/plugins/plugin-enevtiUserMeta/config',
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
      getUserMeta: async params => {
        if (this._db === undefined) {
          throw new Error('enevti user meta db instance is not ready!');
        }
        const { address } = params as { address: string };
        const userMeta = await getEnevtiUserMeta(this._db, address);
        return userMeta;
      },
      setUserMeta: async params => {
        if (this._db === undefined) {
          throw new Error('enevti user meta db instance is not ready!');
        }

        const { publicKey, meta, signature } = params as {
          publicKey: string;
          meta: string;
          signature: string;
        };

        const address = cryptography
          .getAddressFromPublicKey(Buffer.from(publicKey, 'hex'))
          .toString('hex');

        const userMeta = await getEnevtiUserMeta(this._db, address);
        const parsedMeta = JSON.parse(meta) as EnevtiUserMeta;
        if (userMeta && shallowCompare(userMeta, parsedMeta)) return;

        if (
          !cryptography.verifyData(
            cryptography.stringToBuffer(meta),
            Buffer.from(signature, 'hex'),
            Buffer.from(publicKey, 'hex'),
          )
        ) {
          throw new Error(`setUserMeta failed because of invalid signature`);
        }

        await setEnevtiUserMeta(this._db, address, JSON.parse(meta) as EnevtiUserMeta);
      },
    };
  }

  public async load(_: BaseChannel): Promise<void> {
    this._db = await getDBInstance();
  }

  public async unload(): Promise<void> {
    await this._db?.close();
  }
}
