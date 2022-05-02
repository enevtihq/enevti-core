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
  apiClient,
  Transaction,
  // GenesisConfig
} from 'lisk-sdk';
import { getAssetSchema } from './utils/schema';
import {
  accessStakerByAddress,
  addStakeByAddress,
  initStakeByAddress,
  subtractStakeByAddress,
} from './utils/stake';

export class CreatorFinanceModule extends BaseModule {
  public actions = {
    getStakerByAddress: async params => {
      const { address } = params as Record<string, string>;
      return accessStakerByAddress(this._dataAccess, address);
    },
  };
  public reducers = {};
  public name = 'creatorFinance';
  public transactionAssets = [];
  public events = ['totalStakeChanged'];
  public id = 1002;
  public _client: apiClient.APIClient | undefined = undefined;

  // public constructor(genesisConfig: GenesisConfig) {
  //     super(genesisConfig);
  // }

  public async getClient() {
    if (!this._client) {
      this._client = await apiClient.createIPCClient('~/.lisk/enevti-core');
    }
    return this._client;
  }

  // Lifecycle hooks
  public async beforeBlockApply(_input: BeforeBlockApplyContext) {
    // Get any data from stateStore using block info, below is an example getting a generator
    // const generatorAddress = getAddressFromPublicKey(_input.block.header.generatorPublicKey);
    // const generator = await _input.stateStore.account.get<TokenAccount>(generatorAddress);
  }

  public async afterBlockApply(_input: AfterBlockApplyContext) {
    const client = await this.getClient();
    const prevBlock = (await client.block.get(_input.block.header.previousBlockID)) as {
      payload: Transaction[];
    };
    for (const payload of prevBlock.payload) {
      if (payload.moduleID === 5 && payload.assetID === 1) {
        const voteSchema = await getAssetSchema(client, payload.moduleID, payload.assetID);
        const voteAsset = codec.decode<Record<string, unknown>>(voteSchema, payload.asset);
        (voteAsset.votes as Record<string, unknown>[]).forEach(item => {
          this._channel.publish('creatorFinance:totalStakeChanged', {
            address: (item.delegateAddress as Buffer).toString('hex'),
          });
        });
      }
    }
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
    if (_input.transaction.moduleID === 5 && _input.transaction.assetID === 0) {
      await initStakeByAddress(_input.stateStore, _input.transaction.senderAddress.toString('hex'));
    }
  }

  public async afterGenesisBlockApply(_input: AfterGenesisBlockApplyContext) {
    // Get any data from genesis block, for example get all genesis accounts
    // const genesisAccounts = genesisBlock.header.asset.accounts;
  }
}
