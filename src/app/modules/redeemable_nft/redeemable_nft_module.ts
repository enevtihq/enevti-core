import {
  AfterBlockApplyContext,
  AfterGenesisBlockApplyContext,
  BaseModule,
  BeforeBlockApplyContext,
  GenesisConfig,
  TransactionApplyContext,
} from 'lisk-sdk';
import { SocialRaffleGenesisConfig } from '../../../types/core/chain/config/SocialRaffleGenesisConfig';
import { redeemableNftActions } from './actions';
import { CommentCollectionAsset } from './assets/comment_collection_asset';
import { CommentCollectionClubsAsset } from './assets/comment_collection_clubs_asset';
import { CommentNftAsset } from './assets/comment_nft_asset';
import { CommentNftClubsAsset } from './assets/comment_nft_clubs_asset';
import { CreateOnekindNftAsset } from './assets/create_onekind_nft_asset';
import { DeliverSecretAsset } from './assets/deliver_secret_asset';
import { LikeCollectionAsset } from './assets/like_collection_asset';
import { LikeCommentAsset } from './assets/like_comment_asset';
import { LikeCommentClubsAsset } from './assets/like_comment_clubs_asset';
import { LikeNftAsset } from './assets/like_nft_asset';
import { LikeReplyAsset } from './assets/like_reply_asset';
import { LikeReplyClubsAsset } from './assets/like_reply_clubs_asset';
import { MintMomentAsset } from './assets/mint_moment_asset';
import { MintNftAsset } from './assets/mint_nft_asset';
import { MintNftTypeQrAsset } from './assets/mint_nft_type_qr_asset';
import { ReplyCommentAsset } from './assets/reply_comment_asset';
import { ReplyCommentClubsAsset } from './assets/reply_comment_clubs_asset';
import { SetVideoCallAnsweredAsset } from './assets/set_video_call_answered_asset';
import { SetVideoCallRejectedAsset } from './assets/set_video_call_rejected_asset';
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
    new CommentCollectionClubsAsset(),
    new CommentNftClubsAsset(),
    new ReplyCommentClubsAsset(),
    new LikeReplyClubsAsset(),
    new LikeCommentClubsAsset(),
    new SetVideoCallRejectedAsset(),
    new SetVideoCallAnsweredAsset(),
    new MintMomentAsset(),
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
    'videoCallStatusChanged',
  ];
  public id = 1000;
  public accountSchema = redeemableNftAccountSchema;

  // public constructor(genesisConfig: GenesisConfig) {
  //     super(genesisConfig);
  // }

  // Lifecycle hooks
  public async beforeBlockApply(_input: BeforeBlockApplyContext) {
    // Get any data from stateStore using block info, below is an example getting a generator
    // const generatorAddress = getAddressFromPublicKey(_input.block.header.generatorPublicKey);
    // const generator = await _input.stateStore.account.get<TokenAccount>(generatorAddress);
  }

  public async afterBlockApply(_input: AfterBlockApplyContext) {
    await redeemableNftAfterBlockApply(_input, this._channel, this.config);
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
