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
  StateStore,
  // GenesisConfig
} from 'lisk-sdk';
import { CreaFiAccountProps } from 'enevti-types/account/profile';
import { creafiAccountSchema } from './schema/account';
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
  public reducers = {
    getTotalStake: async (
      params: Record<string, unknown>,
      stateStore: StateStore,
    ): Promise<bigint> => {
      const { address } = params;
      if (!Buffer.isBuffer(address)) {
        throw new Error('Address must be a buffer');
      }
      const account = await stateStore.account.getOrDefault<CreaFiAccountProps>(address);
      return account.creatorFinance.totalStake;
    },
  };
  public name = 'creatorFinance';
  public transactionAssets = [];
  public events = ['totalStakeChanged', 'stakerUpdates'];
  public id = 1002;
  public accountSchema = creafiAccountSchema;

  // public constructor(genesisConfig: GenesisConfig) {
  //     super(genesisConfig);
  // }

  // Lifecycle hooks
  public async beforeBlockApply(_input: BeforeBlockApplyContext) {
    // Get any data from stateStore using block info, below is an example getting a generator
    // const generatorAddress = getAddressFromPublicKey(_input.block.header.generatorPublicKey);
    // const generator = await _input.stateStore.account.get<TokenAccount>(generatorAddress);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async afterBlockApply(_input: AfterBlockApplyContext) {
    for (const payload of _input.block.payload) {
      if (payload.moduleID === 5 && payload.assetID === 1) {
        const voteAsset = codec.decode<VoteTransactionAssetContext>(
          new VoteTransactionAsset().schema,
          payload.asset,
        );
        voteAsset.votes.forEach(item => {
          this._channel.publish('creatorFinance:stakerUpdates', {
            address: item.delegateAddress.toString('hex'),
          });
          this._channel.publish('creatorFinance:totalStakeChanged', {
            address: item.delegateAddress.toString('hex'),
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
            id: _input.transaction.id,
            persona: _input.transaction.senderAddress,
            stake: vote.amount,
          });
        } else {
          await subtractStakeByAddress(_input.stateStore, vote.delegateAddress.toString('hex'), {
            id: _input.transaction.id,
            persona: _input.transaction.senderAddress,
            stake: vote.amount,
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
