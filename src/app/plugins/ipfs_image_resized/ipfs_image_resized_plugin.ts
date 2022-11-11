import { BasePlugin, PluginInfo } from 'lisk-sdk';
import type { BaseChannel, EventsDefinition, ActionsDefinition, SchemaWithDefault } from 'lisk-sdk';
import { getIpfsResizedUri, isIpfsResized, storeResizedImage } from './utils/actions';
import { isValidSize, SizeCode } from './utils/resizer';

/* eslint-disable class-methods-use-this */
/* eslint-disable  @typescript-eslint/no-empty-function */
export class IpfsImageResizedPlugin extends BasePlugin {
  // private _channel!: BaseChannel;

  public static get alias(): string {
    return 'ipfsImageResized';
  }

  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
  public static get info(): PluginInfo {
    return {
      author: 'enevtihq',
      version: '0.1.0',
      name: 'ipfsImageResized',
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  public get defaults(): SchemaWithDefault {
    return {
      $id: '/plugins/plugin-ipfsImageResized/config',
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
      isIpfsResized: async params => {
        const { hash } = params as { hash: string };
        const isResized = await isIpfsResized(hash);
        return isResized;
      },
      getIpfsResizedUri: async params => {
        const { hash, size } = params as { hash: string; size: string };
        if (!isValidSize(size)) return undefined;
        const uri = await getIpfsResizedUri(hash, size as SizeCode);
        return uri;
      },
      storeResizedImage: async params => {
        const { hash } = params as { hash: string };
        return storeResizedImage(hash);
      },
    };
  }

  public async load(_: BaseChannel): Promise<void> {
    // this._channel = channel;
    // this._channel.once('app:ready', () => {});
  }

  public async unload(): Promise<void> {}
}
