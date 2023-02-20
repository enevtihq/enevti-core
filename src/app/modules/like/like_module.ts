/* eslint-disable class-methods-use-this */

import {
  AfterBlockApplyContext,
  AfterGenesisBlockApplyContext,
  BaseModule,
  BeforeBlockApplyContext,
  TransactionApplyContext,
} from 'lisk-sdk';
import { likeActions } from './actions';
import { AddLikeAsset } from './assets/add_like_asset';
import { LIKE_MODULE_PREFIX } from './constants/codec';
import { LIKE_MODULE_ID } from './constants/id';
import activityAfterTransactionApply from './hook/afterTransactionApply';
import { likeReducers } from './reducers';

export class LikeModule extends BaseModule {
  public actions = likeActions.bind(this);
  public reducers = likeReducers.bind(this);
  public name = LIKE_MODULE_PREFIX;
  public transactionAssets = [new AddLikeAsset()];
  public events = ['newLike'];
  public id = LIKE_MODULE_ID;

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
    // Get any data from stateStore using block info, below is an example getting a generator
    // const generatorAddress = getAddressFromPublicKey(_input.block.header.generatorPublicKey);
    // const generator = await _input.stateStore.account.get<TokenAccount>(generatorAddress);
  }

  public async beforeTransactionApply(_input: TransactionApplyContext) {
    // Get any data from stateStore using transaction info, below is an example
    // const sender = await _input.stateStore.account.getOrDefault<TokenAccount>(_input.transaction.senderAddress);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async afterTransactionApply(_input: TransactionApplyContext) {
    activityAfterTransactionApply(_input, this._channel);
  }

  public async afterGenesisBlockApply(_input: AfterGenesisBlockApplyContext) {
    // Get any data from genesis block, for example get all genesis accounts
    // const genesisAccounts = genesisBlock.header.asset.accounts;
  }
}
