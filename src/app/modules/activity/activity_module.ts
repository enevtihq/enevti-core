/* eslint-disable class-methods-use-this */

import {
  BaseModule,
  AfterBlockApplyContext,
  TransactionApplyContext,
  BeforeBlockApplyContext,
  AfterGenesisBlockApplyContext,
  // GenesisConfig
} from 'lisk-sdk';
import { ACTIVITY_MODULE_ID } from 'enevti-types/constant/id';
import { activityActions } from './actions';
import { ACTIVITY_PREFIX } from './constants/codec';
import activityAfterBlockApply from './hook/afterBlockApply';
import { activityReducers } from './reducers';

export class ActivityModule extends BaseModule {
  public actions = activityActions.bind(this)();
  public reducers = activityReducers.bind(this)();
  public name = ACTIVITY_PREFIX;
  public transactionAssets = [];
  public events = ['newActivity', 'blockWithNewActivity'];
  public id = ACTIVITY_MODULE_ID;

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
    await activityAfterBlockApply(_input, this._channel);
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
    // Get any data from genesis block, for example get all genesis accounts
    // const genesisAccounts = genesisBlock.header.asset.accounts;
  }
}
