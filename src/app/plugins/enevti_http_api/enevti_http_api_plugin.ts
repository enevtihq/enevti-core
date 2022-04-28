/* eslint-disable @typescript-eslint/no-misused-promises */
import { BasePlugin, PluginInfo } from 'lisk-sdk';
import type { BaseChannel, EventsDefinition, ActionsDefinition, SchemaWithDefault } from 'lisk-sdk';
import { Server } from 'http';
import * as express from 'express';
import * as cors from 'cors';
import controller from './controller';

/* eslint-disable class-methods-use-this */
/* eslint-disable  @typescript-eslint/no-empty-function */
export class EnevtiHttpApiPlugin extends BasePlugin {
  private _server: Server | undefined = undefined;
  private _app: express.Express | undefined = undefined;
  private _channel: BaseChannel | undefined = undefined;

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

  // eslint-disable-next-line @typescript-eslint/require-await
  public async load(channel: BaseChannel): Promise<void> {
    this._app = express();
    this._channel = channel;

    this._app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT'] }));
    this._app.use(express.json());

    this._app.get('/collection', controller.getAllCollection(this._channel));
    this._app.get('/collection/id/:id', controller.getCollectionById(this._channel));
    this._app.get('/collection/n/:name', controller.getCollectionByName(this._channel));
    this._app.get('/collection/s/:symbol', controller.getCollectionBySymbol(this._channel));
    this._app.get('/nft', controller.getAllNFT(this._channel));
    this._app.get('/nft/id/:id', controller.getNFTById(this._channel));
    this._app.get('/nft/s/:serial', controller.getNFTBySerial(this._channel));
    this._app.get('/nft/template', controller.getAllNFTTemplate(this._channel));
    this._app.get('/nft/template/genesis', controller.getAllNFTTemplateGenesis(this._channel));
    this._app.get('/nft/template/:id', controller.getNFTTemplateById(this._channel));
    this._app.get('/profile/:address', controller.getProfile(this._channel));
    this._app.get('/profile/:address/nonce', controller.getProfileNonce(this._channel));
    this._app.get('/persona/a/:address', controller.getPersonaByAddress(this._channel));
    this._app.get('/persona/u/:username', controller.getPersonaByUsername(this._channel));
    this._app.get('/stake/a/:address', controller.getStakePoolByAddress(this._channel));
    this._app.get('/stake/u/:username', controller.getStakePoolByUsername(this._channel));
    this._app.get('/feeds', controller.getFeeds(this._channel));
    this._app.get('/registrar/name/:name', controller.isNameExists(this._channel));
    this._app.get('/registrar/symbol/:symbol', controller.isSymbolExists(this._channel));
    this._app.get('/registrar/serial/:serial', controller.isSerialExists(this._channel));
    this._app.get('/registrar/username/:username', controller.isUsernameExists(this._channel));
    this._app.post('/transaction/fee', controller.getTransactionFee(this._channel));
    this._app.get(
      '/transaction/basefee/:moduleID/:assetID',
      controller.getTransactionBaseFee(this._channel),
    );
    this._app.post('/transaction/post', controller.postTransaction(this._channel, this.codec));

    this._server = this._app.listen(8080, '0.0.0.0');
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
