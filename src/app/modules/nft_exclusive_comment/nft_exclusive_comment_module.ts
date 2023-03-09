/* eslint-disable class-methods-use-this */

import {
  AfterBlockApplyContext,
  AfterGenesisBlockApplyContext,
  BaseModule,
  BeforeBlockApplyContext,
  TransactionApplyContext,
} from 'lisk-sdk';
import { EXCLUSIVE_COMMENT_MODULE_ID } from 'enevti-types/constant/id';
import { exclusiveCommentActions } from './actions';
import { AddExclusiveCommentAsset } from './assets/add_exclusive_comment_asset';
import { AddExclusiveReplyAsset } from './assets/add_exclusive_reply_asset';
import { EXCLUSIVE_COMMENT_PREFIX } from './constants/codec';
import exclusiveCommentAfterTransactionApply from './hook/afterTransactionApply';
import { exclusiveCommentReducers } from './reducers';

export class NftExclusiveCommentModule extends BaseModule {
  public actions = exclusiveCommentActions.bind(this)();
  public reducers = exclusiveCommentReducers.bind(this)();
  public name = EXCLUSIVE_COMMENT_PREFIX;
  public transactionAssets = [new AddExclusiveCommentAsset(), new AddExclusiveReplyAsset()];
  public events = ['newExclusiveComment', 'newExclusiveReply'];
  public id = EXCLUSIVE_COMMENT_MODULE_ID;

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
    exclusiveCommentAfterTransactionApply(_input, this._channel);
  }

  public async afterGenesisBlockApply(_input: AfterGenesisBlockApplyContext) {
    // Get any data from genesis block, for example get all genesis accounts
    // const genesisAccounts = genesisBlock.header.asset.accounts;
  }
}
