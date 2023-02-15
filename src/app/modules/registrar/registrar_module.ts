/* eslint-disable class-methods-use-this */

import {
  BaseModule,
  AfterBlockApplyContext,
  TransactionApplyContext,
  BeforeBlockApplyContext,
  AfterGenesisBlockApplyContext,
  // GenesisConfig
} from 'lisk-sdk';
import { registrarActions } from './actions';
import { REGISTRAR_PREFIX } from './constants/codec';
import { REGISTRAR_MODULE_ID } from './constants/id';
import registrarAfterBlockApply from './hook/afterBlockApply';
import { registrarReducers } from './reducers';

export class RegistrarModule extends BaseModule {
  public actions = registrarActions.bind(this)();
  public reducers = registrarReducers.bind(this)();
  public name = REGISTRAR_PREFIX;
  public transactionAssets = [];
  public events = ['newRegistrar'];
  public id = REGISTRAR_MODULE_ID;

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
    await registrarAfterBlockApply(_input, this._channel);
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
