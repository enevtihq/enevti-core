/* eslint-disable @typescript-eslint/no-misused-promises */
import { apiClient, BasePlugin, PluginInfo } from 'lisk-sdk';
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
  private _client: apiClient.APIClient | undefined = undefined;

  public async getClient() {
    if (!this._client) {
      this._client = await apiClient.createIPCClient('~/.lisk/enevti-core');
    }
    return this._client;
  }

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
    const client = await this.getClient();

    this._app = express();
    this._channel = channel;

    this._app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT'] }));
    this._app.use(express.json());

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this._app.get('/avatar/:wallet', controller.renderAvatar());
    this._app.get('/avatar/url/:address', controller.getAvatarUrl(this._channel));
    this._app.get('/activity/collection/:id', controller.getActivityCollection(this._channel));
    this._app.get('/activity/moment/:id', controller.getActivityMoment(this._channel));
    this._app.get('/activity/nft/:id', controller.getActivityNFT(this._channel));
    this._app.get(
      '/activity/profile/:address',
      controller.getActivityProfile(this._channel, client),
    );
    this._app.get('/activity/engagement/:address', controller.getActivityEngagement(this._channel));
    this._app.get('/collection', controller.getAllCollection(this._channel));
    this._app.get('/collection/id/:id', controller.getCollectionById(this._channel));
    this._app.get('/collection/id/:id/minted', controller.getCollectionMintedById(this._channel));
    this._app.get(
      '/collection/id/:id/activity',
      controller.getCollectionActivityById(this._channel),
    );
    this._app.get('/collection/n/:name', controller.getCollectionByName(this._channel));
    this._app.get('/collection/s/:symbol', controller.getCollectionBySymbol(this._channel));
    this._app.get('/nft', controller.getAllNFT(this._channel));
    this._app.get('/nft/id/:id', controller.getNFTById(this._channel));
    this._app.get('/nft/id/:id/activity', controller.getNFTActivityById(this._channel));
    this._app.get('/nft/s/:serial', controller.getNFTBySerial(this._channel));
    this._app.get('/nft/template', controller.getAllNFTTemplate(this._channel));
    this._app.get('/nft/template/genesis', controller.getAllNFTTemplateGenesis(this._channel));
    this._app.get('/nft/template/:id', controller.getNFTTemplateById(this._channel));
    this._app.get('/profile/:address', controller.getProfile(this._channel));
    this._app.get('/profile/:address/staked', controller.getProfileStaked(this._channel));
    this._app.get('/profile/:address/owned', controller.getProfileOwned(this._channel));
    this._app.get('/profile/:address/moment', controller.getProfileCreatedMoment(this._channel));
    this._app.get('/profile/:address/collection', controller.getProfileCollection(this._channel));
    this._app.get('/profile/:address/pending', controller.getProfilePendingDelivery(this._channel));
    this._app.get('/profile/:address/nonce', controller.getProfileNonce(this._channel));
    this._app.get('/profile/:address/balance', controller.getProfileBalance(this._channel));
    this._app.get('/persona/a/:address', controller.getPersonaByAddress(this._channel));
    this._app.get('/persona/u/:username', controller.getPersonaByUsername(this._channel));
    this._app.get('/stake/a/:address', controller.getStakePoolByAddress(this._channel));
    this._app.get(
      '/stake/a/:address/staker',
      controller.getStakePoolStakerByAddress(this._channel),
    );
    this._app.get('/stake/u/:username', controller.getStakePoolByUsername(this._channel));
    this._app.get('/feeds/unavailable', controller.getUnavailableFeeds(this._channel));
    this._app.get('/feeds/available', controller.getAvailableFeeds(this._channel));
    this._app.get('/registrar/name/:name', controller.isNameExists(this._channel));
    this._app.get('/registrar/name/:name/id', controller.nameToCollection(this._channel));
    this._app.get('/registrar/symbol/:symbol', controller.isSymbolExists(this._channel));
    this._app.get('/registrar/symbol/:symbol/id', controller.symbolToCollection(this._channel));
    this._app.get('/registrar/serial/:serial', controller.isSerialExists(this._channel));
    this._app.get('/registrar/serial/:serial/id', controller.serialToNFT(this._channel));
    this._app.get('/registrar/username/:username', controller.isUsernameExists(this._channel));
    this._app.get('/registrar/username/:username/id', controller.usernameToAddress(this._channel));
    this._app.get('/transaction/:id', controller.getTransactionById(this._channel, client));
    this._app.get(
      '/transaction/:id/status',
      controller.getTransactionStatus(this._channel, client),
    );
    this._app.post('/transaction/fee', controller.getTransactionFee(this._channel));
    this._app.post(
      '/transaction/dynamicBaseFee',
      controller.getTransactionDynamicBaseFee(this._channel),
    );
    this._app.get(
      '/transaction/basefee/:moduleID/:assetID',
      controller.getTransactionBaseFee(this._channel),
    );
    this._app.post('/transaction/post', controller.postTransaction(this._channel, this.codec));
    this._app.get('/wallet/:address', controller.getWallet(this._channel));
    this._app.get('/comment/:id', controller.getComment(this._channel));
    this._app.get('/comment/clubs/:id', controller.getCommentClubs(this._channel));
    this._app.get('/comment/moment/:id', controller.getMomentComment(this._channel));
    this._app.get('/comment/moment/clubs/:id', controller.getMomentCommentClubs(this._channel));
    this._app.get('/comment/nft/:id', controller.getNFTComment(this._channel));
    this._app.get('/comment/nft/clubs/:id', controller.getNFTCommentClubs(this._channel));
    this._app.get('/comment/collection/:id', controller.getCollectionComment(this._channel));
    this._app.get(
      '/comment/collection/clubs/:id',
      controller.getCollectionCommentClubs(this._channel),
    );
    this._app.get('/like/nft/:id', controller.getNFTLike(this._channel));
    this._app.get('/like/collection/:id', controller.getCollectionLike(this._channel));
    this._app.get('/like/comment/:id', controller.getCommentLike(this._channel));
    this._app.get('/like/comment/clubs/:id', controller.getCommentClubsLike(this._channel));
    this._app.get('/like/reply/:id', controller.getReplyLike(this._channel));
    this._app.get('/like/reply/clubs/:id', controller.getReplyClubsLike(this._channel));
    this._app.get('/liked/:id/:address', controller.getLiked(this._channel));
    this._app.get('/reply/:id', controller.getReply(this._channel));
    this._app.get('/reply/clubs/:id', controller.getReplyClubs(this._channel));
    this._app.get('/reply/comment/:id', controller.getCommentReply(this._channel));
    this._app.get('/reply/comment/clubs/:id', controller.getCommentClubsReply(this._channel));
    this._app.get('/tag/collection', controller.getCollectionTag(this._channel));
    this._app.get('/tag/username', controller.getUsernameTag(this._channel));
    this._app.get('/tag/nft', controller.getNFTTag(this._channel));
    this._app.get('/raffle', controller.getSocialRaffleState(this._channel));
    this._app.get('/raffle/:height', controller.getSocialRaffleRecord(this._channel));
    this._app.get('/config/raffle', controller.getSocialRaffleConfig(this._channel));
    this._app.get(
      '/authorized/collection/:id',
      controller.isAddressCollectionOwnerOrCreator(this._channel),
    );
    this._app.get('/authorized/nft/:id', controller.isAddressNFTOwnerOrCreator(this._channel));
    this._app.get('/fcm/ready', controller.getFCMIsReady(this._channel));
    this._app.get('/fcm/registered/:address', controller.getFCMIsAddressRegistered(this._channel));
    this._app.post('/fcm/register', controller.postFCMRegisterAddress(this._channel));
    this._app.post('/fcm/isupdated', controller.postFCMIsTokenUpdated(this._channel));
    this._app.delete('/fcm/remove', controller.deleteFCMAddress(this._channel));
    this._app.get('/apn/ready', controller.getAPNIsReady(this._channel));
    this._app.get('/apn/registered/:address', controller.getAPNIsAddressRegistered(this._channel));
    this._app.post('/apn/register', controller.postAPNRegisterAddress(this._channel));
    this._app.post('/apn/isupdated', controller.postAPNIsTokenUpdated(this._channel));
    this._app.delete('/apn/remove', controller.deleteAPNAddress(this._channel));
    this._app.post('/usermeta/set', controller.postUserMeta(this._channel));
    this._app.get('/moment', controller.getAllMoment(this._channel));
    this._app.get('/moment/:id', controller.getMomentById(this._channel));

    this._server = this._app.listen(8880, '0.0.0.0');
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
