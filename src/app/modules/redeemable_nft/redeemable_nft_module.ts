import {
  AfterBlockApplyContext,
  AfterGenesisBlockApplyContext,
  BaseModule,
  BeforeBlockApplyContext,
  TransactionApplyContext,
} from 'lisk-sdk';
import { redeemableNftActions } from './actions';
import { CreateOnekindNftAsset } from './assets/create_onekind_nft_asset';
import { DeliverSecretAsset } from './assets/deliver_secret_asset';
import { MintMomentAsset } from './assets/mint_moment_asset';
import { MintNftAsset } from './assets/mint_nft_asset';
import { MintNftTypeQrAsset } from './assets/mint_nft_type_qr_asset';
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
    'totalMomentSlotChanged',
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
    await redeemableNftAfterBlockApply(_input, this._channel);
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
    await redeemableNftAfterGenesisBlockApply(_input);
  }
}
