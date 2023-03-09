/* eslint-disable class-methods-use-this */

import {
  AfterBlockApplyContext,
  AfterGenesisBlockApplyContext,
  BaseModule,
  BeforeBlockApplyContext,
  TransactionApplyContext,
} from 'lisk-sdk';
import { COMMENT_MODULE_ID } from 'enevti-types/constant/id';
import { commentActions } from './actions';
import { AddCommentAsset } from './assets/add_comment_asset';
import { COMMENT_PREFIX } from './constants/codec';
import commentAfterTransactionApply from './hook/afterTransactionApply';
import { commentReducers } from './reducers';

export class CommentModule extends BaseModule {
  public actions = commentActions.bind(this)();
  public reducers = commentReducers.bind(this)();
  public name = COMMENT_PREFIX;
  public transactionAssets = [new AddCommentAsset()];
  public events = ['newComment'];
  public id = COMMENT_MODULE_ID;

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
    commentAfterTransactionApply(_input, this._channel);
  }

  public async afterGenesisBlockApply(_input: AfterGenesisBlockApplyContext) {
    // Get any data from genesis block, for example get all genesis accounts
    // const genesisAccounts = genesisBlock.header.asset.accounts;
  }
}
