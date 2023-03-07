/* eslint-disable class-methods-use-this */

import { SocialRaffleConfig } from 'enevti-types/chain/social_raffle/config';
import {
  BaseModule,
  AfterBlockApplyContext,
  TransactionApplyContext,
  BeforeBlockApplyContext,
  AfterGenesisBlockApplyContext,
  GenesisConfig,
  // GenesisConfig
} from 'lisk-sdk';
import { socialRaffleActions } from './actions';
import { SOCIAL_RAFFLE_PREFIX } from './constants/codec';
import { SOCIAL_RAFFLE_MODULE_ID } from './constants/id';
import socialRaffleAfterBlockApply from './hook/afterBlockApply';
import socialRaffleAfterGenesisBlockApply from './hook/afterGenesisBlockApply';
import socialRaffleAfterTransactionApply from './hook/afterTransactionApply';
import { socialRaffleReducers } from './reducers';

export class SocialRaffleModule extends BaseModule {
  public actions = socialRaffleActions.bind(this)();
  public reducers = socialRaffleReducers.bind(this)();
  public name = SOCIAL_RAFFLE_PREFIX;
  public transactionAssets = [];
  public events = ['newBlockRecord'];
  public id = SOCIAL_RAFFLE_MODULE_ID;

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
    await socialRaffleAfterBlockApply(
      _input,
      this._channel,
      this.config as GenesisConfig & SocialRaffleConfig,
    );
  }

  public async beforeTransactionApply(_input: TransactionApplyContext) {
    // Get any data from stateStore using transaction info, below is an example
    // const sender = await _input.stateStore.account.getOrDefault<TokenAccount>(_input.transaction.senderAddress);
  }

  public async afterTransactionApply(_input: TransactionApplyContext) {
    await socialRaffleAfterTransactionApply(_input);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async afterGenesisBlockApply(_input: AfterGenesisBlockApplyContext) {
    socialRaffleAfterGenesisBlockApply(this.config as GenesisConfig & SocialRaffleConfig);
  }
}
