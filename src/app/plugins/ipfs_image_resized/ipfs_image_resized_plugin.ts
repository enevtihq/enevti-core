import { BasePlugin, PluginInfo } from 'lisk-sdk';
import type { BaseChannel, EventsDefinition, ActionsDefinition, SchemaWithDefault } from 'lisk-sdk';
import {
  getIpfsResizedDirName,
  getIpfsResizedUri,
  isIpfsResized,
  storeResizedImage,
} from './utils/actions';
import { isValidSize } from './utils/resizer';
import { initPluginDirectory } from './utils/dir';
import { SizeCode } from 'enevti-types/service/api';

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
      getIpfsResizedDirName: async () => {
        const dir = await getIpfsResizedDirName();
        return dir;
      },
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
    await initPluginDirectory();
  }

  public async unload(): Promise<void> {}
}
