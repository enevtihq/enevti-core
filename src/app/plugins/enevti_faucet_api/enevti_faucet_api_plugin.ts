/* eslint-disable @typescript-eslint/no-misused-promises */
import { apiClient, BasePlugin, cryptography, PluginInfo } from 'lisk-sdk';
import type { BaseChannel, EventsDefinition, ActionsDefinition, SchemaWithDefault } from 'lisk-sdk';
import { Server } from 'http';
import * as express from 'express';
import * as cors from 'cors';
import { invokeGetAccount } from '../enevti_http_api/utils/hook/persona_module';
// import controller from './controller';

/* eslint-disable class-methods-use-this */
/* eslint-disable  @typescript-eslint/no-empty-function */
export class EnevtiFaucetApiPlugin extends BasePlugin {
  // private _channel: BaseChannel | undefined = undefined;
  private _server: Server | undefined = undefined;
  private _app: express.Express | undefined = undefined;
  private _client: apiClient.APIClient | undefined = undefined;
  private readonly _passphrase: string =
    '626f7920636f696c207368617265206e657874206c656d6f6e20766965772064616e6765722077656972642073686f76652068756220706172656e7420656e6a6f79';
  private _nonce = 0;

  public static get alias(): string {
    return 'enevtiFaucetApi';
  }

  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
  public static get info(): PluginInfo {
    return {
      author: 'enevtihq',
      version: '0.1.0',
      name: 'enevtiFaucetApi',
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  public get defaults(): SchemaWithDefault {
    return {
      $id: '/plugins/plugin-enevtiFaucetApi/config',
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
    this._logger.info('Enevti Faucet is for Development Purposes only!');
    try {
      this._client = await apiClient.createClient(channel);
      this._app = express();
      // this._channel = channel;

      const account = await invokeGetAccount(
        channel,
        cryptography
          .getAddressFromPassphrase(Buffer.from(this._passphrase, 'hex').toString())
          .toString('hex'),
      );
      this._nonce = Number(account.sequence.nonce);

      this._app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT'] }));
      this._app.use(express.json());

      this._app.post('/faucet', async (req, res) => {
        try {
          if (!this._client) throw new Error('client is undefined');

          const transferTransactionAsset = {
            amount: BigInt(200000000000),
            recipientAddress: Buffer.from((req.body as { address: string }).address, 'hex'),
            data: '',
          };

          const transaction = await this._client.transaction.create(
            {
              moduleID: 2,
              assetID: 0,
              senderPublicKey: cryptography.getPrivateAndPublicKeyFromPassphrase(
                Buffer.from(this._passphrase, 'hex').toString(),
              ).publicKey,
              fee: BigInt(10000000),
              asset: transferTransactionAsset,
              nonce: BigInt(this._nonce),
            },
            Buffer.from(this._passphrase, 'hex').toString(),
          );

          this._nonce += 1;
          await this._client.transaction.send(transaction);
          res.status(200).json({ data: 'success', meta: req.body as Record<string, string> });
        } catch (err: unknown) {
          res
            .status(409)
            .json({ data: (err as string).toString(), meta: req.body as Record<string, string> });
        }
      });
      // this._app.patch('/faucet/authorize', controller.authorizeFaucet(this._channel));

      this._server = this._app.listen(8881, '0.0.0.0');
    } catch (err) {
      this._logger.info('Faucet is disabled');
    }
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
