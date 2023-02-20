/* eslint-disable class-methods-use-this */

import {
  BaseModule,
  AfterBlockApplyContext,
  TransactionApplyContext,
  BeforeBlockApplyContext,
  AfterGenesisBlockApplyContext,
  // GenesisConfig
} from 'lisk-sdk';
import { countActions } from './actions';
import { COUNT_PREFIX } from './constants/codec';
import { COUNT_MODULE_ID } from './constants/id';
import { countReducers } from './reducers';

export class CountModule extends BaseModule {
  public actions = countActions.bind(this)();
  public reducers = countReducers.bind(this)();
  public name = COUNT_PREFIX;
  public transactionAssets = [];
  public events = [];
  public id = COUNT_MODULE_ID;

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

  public async afterTransactionApply(_input: TransactionApplyContext) {
    // Get any data from stateStore using transaction info, below is an example
    // const sender = await _input.stateStore.account.getOrDefault<TokenAccount>(_input.transaction.senderAddress);
  }

  public async afterGenesisBlockApply(_input: AfterGenesisBlockApplyContext) {
    // Get any data from genesis block, for example get all genesis accounts
    // const genesisAccounts = genesisBlock.header.asset.accounts;
  }
}
