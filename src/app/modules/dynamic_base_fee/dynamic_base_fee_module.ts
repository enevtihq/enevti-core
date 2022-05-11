/* eslint-disable class-methods-use-this */

import { CHAIN_STATE_BURNT_FEE } from '@liskhq/lisk-chain/dist-node/constants';
import {
  BaseModule,
  AfterBlockApplyContext,
  TransactionApplyContext,
  BeforeBlockApplyContext,
  AfterGenesisBlockApplyContext,
  GenesisConfig,
  cryptography,
} from 'lisk-sdk';
import { getBaseFee, getDynamicBaseFee, getDynamicBaseFeePerByte, getTotalFees } from './utils/fee';

export class DynamicBaseFeeModule extends BaseModule {
  public actions = {
    // eslint-disable-next-line @typescript-eslint/require-await
    getDynamicBaseFeePerByte: async params => {
      const { transaction } = params as Record<string, { moduleID: number; assetID: number }>;
      return getDynamicBaseFeePerByte(this.config, transaction);
    },
    // eslint-disable-next-line @typescript-eslint/require-await
    getBaseFee: async params => {
      const { transaction } = params as Record<string, { moduleID: number; assetID: number }>;
      return getBaseFee(this.config, transaction);
    },
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
  public name = 'dynamicBaseFee';
  public transactionAssets = [];
  public events = [
    // Example below
    // 'dynamicBaseFee:newBlock',
  ];
  public id = 1003;

  public constructor(genesisConfig: GenesisConfig) {
    super(genesisConfig);
    if (genesisConfig.minFeePerByte !== 0)
      throw new Error('genesisConfig.minFeePerByte must be 0 to use dynamicBaseFee module');
  }

  // Lifecycle hooks
  public async beforeBlockApply(_input: BeforeBlockApplyContext) {
    // Get any data from stateStore using block info, below is an example getting a generator
    // const generatorAddress = getAddressFromPublicKey(_input.block.header.generatorPublicKey);
    // const generator = await _input.stateStore.account.get<TokenAccount>(generatorAddress);
  }

  public async afterBlockApply(_input: AfterBlockApplyContext) {
    if (!_input.block.payload.length) return;
    const generatorAddress = cryptography.getAddressFromPublicKey(
      _input.block.header.generatorPublicKey,
    );

    const totalFeeBurntBuffer = await _input.stateStore.chain.get(CHAIN_STATE_BURNT_FEE);
    let totalFeeBurnt = totalFeeBurntBuffer ? totalFeeBurntBuffer.readBigInt64BE() : BigInt(0);
    const { totalFee, totalBaseFee, totalDynamicBaseFee } = getTotalFees(this.config, _input.block);

    // revert lisk token module (because minFeePerByte is 0, we only need to calculate totalBaseFee)
    const givenFeeLisk = totalFee - totalBaseFee;
    if (givenFeeLisk > 0) {
      await _input.reducerHandler.invoke('token:debit', {
        address: generatorAddress,
        amount: givenFeeLisk,
      });
      totalFeeBurnt -= totalBaseFee;
    }

    // credit based on dynamicBaseFee
    const givenFee = totalFee - totalDynamicBaseFee;
    if (givenFee > 0) {
      await _input.reducerHandler.invoke('token:credit', {
        address: generatorAddress,
        amount: givenFee,
      });
      totalFeeBurnt += totalDynamicBaseFee;
    }

    // apply on-chain change
    const updatedTotalBurntBuffer = Buffer.alloc(8);
    updatedTotalBurntBuffer.writeBigInt64BE(totalFeeBurnt);
    await _input.stateStore.chain.set(CHAIN_STATE_BURNT_FEE, updatedTotalBurntBuffer);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async beforeTransactionApply(_input: TransactionApplyContext) {
    const dynamicBaseFee = getDynamicBaseFee(this.config, _input.transaction);
    const baseFee = getBaseFee(this.config, _input.transaction);
    if (_input.transaction.fee < dynamicBaseFee + baseFee)
      throw new Error(`Minimum fee is: ${dynamicBaseFee + baseFee}`);
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
