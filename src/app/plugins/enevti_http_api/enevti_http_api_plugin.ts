import { BasePlugin, PluginInfo } from 'lisk-sdk';
import type { BaseChannel, EventsDefinition, ActionsDefinition, SchemaWithDefault } from 'lisk-sdk';

/* eslint-disable class-methods-use-this */
/* eslint-disable  @typescript-eslint/no-empty-function */
export class EnevtiHttpApiPlugin extends BasePlugin {
  // private _channel!: BaseChannel;

  public static get alias(): string {
    return 'enevtiHttpApi';
  }

  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
  public static get info(): PluginInfo {
    return {
      author: 'enevtihq',
      version: '0.1.0',
      name: 'enevtiHttpApi',
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  public get defaults(): SchemaWithDefault {
    return {
      $id: '/plugins/plugin-enevtiHttpApi/config',
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

  public async load(_: BaseChannel): Promise<void> {
    // this._channel = channel;
    // this._channel.once('app:ready', () => {});
  }

  public async unload(): Promise<void> {}
}
