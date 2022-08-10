import {
  AfterBlockApplyContext,
  AfterGenesisBlockApplyContext,
  apiClient,
  BaseModule,
  BeforeBlockApplyContext,
  TransactionApplyContext,
  GenesisConfig,
} from 'lisk-sdk';
import { SocialRaffleGenesisConfig } from '../../../types/core/chain/config/SocialRaffleGenesisConfig';
import { redeemableNftActions } from './actions';
import { CommentCollectionAsset } from './assets/comment_collection_asset';
import { CommentNftAsset } from './assets/comment_nft_asset';
import { CreateOnekindNftAsset } from './assets/create_onekind_nft_asset';
import { DeliverSecretAsset } from './assets/deliver_secret_asset';
import { LikeCollectionAsset } from './assets/like_collection_asset';
import { LikeCommentAsset } from './assets/like_comment_asset';
import { LikeNftAsset } from './assets/like_nft_asset';
import { LikeReplyAsset } from './assets/like_reply_asset';
import { MintNftAsset } from './assets/mint_nft_asset';
import { MintNftTypeQrAsset } from './assets/mint_nft_type_qr_asset';
import { ReplyCommentAsset } from './assets/reply_comment_asset';
import redeemableNftAfterBlockApply from './hook/afterBlockApply';
import redeemableNftAfterGenesisBlockApply from './hook/afterGenesisBlockApply';
import { redeemableNftReducers } from './reducers';
import { redeemableNftAccountSchema } from './schemas/account';

export class RedeemableNftModule extends BaseModule {
  public actions = redeemableNftActions.bind(this)();
  public reducers = redeemableNftReducers.bind(this)();
  public name = 'redeemableNft';
  public transactionAssets = [
    new CreateOnekindNftAsset(),
    new MintNftAsset(),
    new DeliverSecretAsset(),
    new MintNftTypeQrAsset(),
    new LikeNftAsset(),
    new LikeCollectionAsset(),
    new CommentNftAsset(),
    new CommentCollectionAsset(),
    new LikeCommentAsset(),
    new LikeReplyAsset(),
    new ReplyCommentAsset(),
  ];
  public events = [
    'newCollection',
    'newCollectionByAddress',
    'pendingUtilityDelivery',
    'secretDelivered',
    'totalNFTSoldChanged',
    'totalServeRateChanged',
    'newPendingByAddress',
    'newNFTMinted',
    'newActivityCollection',
    'newActivityNFT',
    'newActivityProfile',
    'newNFTLike',
    'newNFTComment',
    'newCollectionLike',
    'newCollectionComment',
    'newRaffled',
    'wonRaffle',
  ];
  public id = 1000;
  public accountSchema = redeemableNftAccountSchema;
  public _client: apiClient.APIClient | undefined = undefined;

  // public constructor(genesisConfig: GenesisConfig) {
  //     super(genesisConfig);
  // }

  public async getClient() {
    if (!this._client) {
      this._client = await apiClient.createIPCClient('~/.lisk/enevti-core');
    }
    return this._client;
  }

  // Lifecycle hooks
  public async beforeBlockApply(_input: BeforeBlockApplyContext) {
    // Get any data from stateStore using block info, below is an example getting a generator
    // const generatorAddress = getAddressFromPublicKey(_input.block.header.generatorPublicKey);
    // const generator = await _input.stateStore.account.get<TokenAccount>(generatorAddress);
  }

  public async afterBlockApply(_input: AfterBlockApplyContext) {
    const client = await this.getClient();
    await redeemableNftAfterBlockApply(_input, this._channel, this.config, client);
  }

  public async beforeTransactionApply(_input: TransactionApplyContext) {
    // Get any data from stateStore using transaction info, below is an example
    // const sender = await _input.stateStore.account.getOrDefault<TokenAccount>(_input.transaction.senderAddress);
  }

  public async afterTransactionApply(_input: TransactionApplyContext) {
    // Get any data from stateStore using transaction info, below is an example
    // const sender = await _input.stateStore.account.getOrDefault<TokenAccount>(_input.transaction.senderAddress);
  }

  public async afterGenesisBlockApply(_input: AfterGenesisBlockApplyContext) {
    if ((this.config as GenesisConfig & SocialRaffleGenesisConfig).socialRaffle.blockInterval < 2)
      throw new Error('config.socialRaffle.blockInterval must be 2 or higher');
    await redeemableNftAfterGenesisBlockApply(_input);
  }
}
