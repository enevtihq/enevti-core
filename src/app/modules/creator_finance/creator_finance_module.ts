/* eslint-disable class-methods-use-this */

import {
  VoteTransactionAsset,
  VoteTransactionAssetContext,
} from 'lisk-framework/dist-node/modules/dpos';
import {
  BaseModule,
  AfterBlockApplyContext,
  TransactionApplyContext,
  BeforeBlockApplyContext,
  AfterGenesisBlockApplyContext,
  codec,
  // GenesisConfig
} from 'lisk-sdk';
import { addStakeByAddress, subtractStakeByAddress } from './utils/stake';

export class CreatorFinanceModule extends BaseModule {
  public actions = {
    // Example below
    // getBalance: async (params) => this._dataAccess.account.get(params.address).token.balance,
    // getBlockByID: async (params) => this._dataAccess.blocks.get(params.id),
  };
  public reducers = {
    // Example below
    // getBalance: async (
    // 	params: Record<string, unknown>,
    // 	stateStore: StateStore,
    // ): Promise<bigint> => {
    // 	const { address } = params;
    // 	if (!Buffer.isBuffer(address)) {
    // 		throw new Error('Address must be a buffer');
    // 	}
    // 	const account = await stateStore.account.getOrDefault<TokenAccount>(address);
    // 	return account.token.balance;
    // },
  };
  public name = 'creatorFinance';
  public transactionAssets = [];
  public events = [
    // Example below
    // 'creatorFinance:newBlock',
  ];
  public id = 1002;

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
    if (_input.transaction.moduleID === 5 && _input.transaction.assetID === 1) {
      const voteAsset = codec.decode<VoteTransactionAssetContext>(
        new VoteTransactionAsset().schema,
        _input.transaction.asset,
      );
      for (const vote of voteAsset.votes) {
        if (vote.amount >= BigInt(0)) {
          await addStakeByAddress(_input.stateStore, vote.delegateAddress.toString('hex'), {
            persona: _input.transaction.senderAddress,
            stake: vote.amount,
            rank: 0,
            portion: 0,
          });
        } else {
          await subtractStakeByAddress(_input.stateStore, vote.delegateAddress.toString('hex'), {
            persona: _input.transaction.senderAddress,
            stake: vote.amount,
            rank: 0,
            portion: 0,
          });
        }
      }
    }
  }

  public async afterGenesisBlockApply(_input: AfterGenesisBlockApplyContext) {
    // Get any data from genesis block, for example get all genesis accounts
    // const genesisAccounts = genesisBlock.header.asset.accounts;
  }
}
