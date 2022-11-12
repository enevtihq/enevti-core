import { BasePlugin, db, PluginInfo } from 'lisk-sdk';
import type { BaseChannel, EventsDefinition, ActionsDefinition, SchemaWithDefault } from 'lisk-sdk';
import { getIPFSTextCache, setIPFSTextCache } from './utils/actions';
import { getDBInstance } from './utils/db';

/* eslint-disable class-methods-use-this */
/* eslint-disable  @typescript-eslint/no-empty-function */
export class IpfsTextCachePlugin extends BasePlugin {
  // private _channel!: BaseChannel;
  private _db: db.KVStore | undefined = undefined;

  public static get alias(): string {
    return 'ipfsTextCache';
  }

  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
  public static get info(): PluginInfo {
    return {
      author: 'enevtihq',
      version: '0.1.0',
      name: 'ipfsTextCache',
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  public get defaults(): SchemaWithDefault {
    return {
      $id: '/plugins/plugin-ipfsTextCache/config',
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
      getIPFSTextCache: async params => {
        if (this._db === undefined) {
          throw new Error('enevti user meta db instance is not ready!');
        }
        const { hash } = params as { hash: string };
        const ipfsTextCache = await getIPFSTextCache(this._db, hash);
        return ipfsTextCache ? ipfsTextCache.text : undefined;
      },
      setIPFSTextCache: async params => {
        if (this._db === undefined) {
          throw new Error('enevti user meta db instance is not ready!');
        }

        const { hash, text } = params as {
          hash: string;
          text: string;
        };

        const ipfsTextCache = await getIPFSTextCache(this._db, hash);
        if (ipfsTextCache) {
          return;
        }

        await setIPFSTextCache(this._db, hash, { text });
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
