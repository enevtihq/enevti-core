/* eslint-disable class-methods-use-this */

import {
  AfterBlockApplyContext,
  AfterGenesisBlockApplyContext,
  apiClient,
  BaseModule,
  BeforeBlockApplyContext,
  codec,
  TransactionApplyContext,
} from 'lisk-sdk';
import { ChangePhotoAsset } from './assets/change_photo_asset';
import { ChangeTwitterAsset } from './assets/change_twitter_asset';
import { personaAccountSchema } from './schema/account';
import { getDefaultAccount } from './utils/account';
import { getAssetSchema } from './utils/schema';
import { accessRegisteredUsername, setRegisteredUsername } from './utils/username';
import { PersonaAccountProps } from '../../../types/core/account/persona';
import { RedeemableNFTAccountProps } from '../../../types/core/account/profile';

export class PersonaModule extends BaseModule {
  public actions = {
    getAccount: async params => {
      const { address } = params as Record<string, string>;
      try {
        const ret = await this._dataAccess.getAccountByAddress<RedeemableNFTAccountProps>(
          Buffer.from(address, 'hex'),
        );
        return ret;
      } catch {
        return getDefaultAccount(address);
      }
    },
    getAddressByUsername: async params => {
      const { username } = params as Record<string, string>;
      return accessRegisteredUsername(this._dataAccess, username);
    },
    isUsernameExists: async params => {
      const { username } = params as Record<string, string>;
      const usernameRegistrar = await accessRegisteredUsername(this._dataAccess, username);
      return !!usernameRegistrar;
    },
  };
  public reducers = {};
  public name = 'persona';
  public transactionAssets = [new ChangePhotoAsset(), new ChangeTwitterAsset()];
  public events = ['newUsername', 'balanceMinus', 'balancePlus'];
  public id = 1001;
  public accountSchema = personaAccountSchema;
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

  // eslint-disable-next-line @typescript-eslint/require-await
  public async afterBlockApply(_input: AfterBlockApplyContext) {
    for (const payload of _input.block.payload) {
      this._channel.publish('persona:balanceMinus', {
        address: payload.senderAddress.toString('hex'),
        amount: payload.fee.toString(),
      });
      if (payload.moduleID === 5 && payload.assetID === 0) {
        const client = await this.getClient();
        const registerSchema = await getAssetSchema(client, payload.moduleID, payload.assetID);
        const registerAsset = codec.decode<Record<string, unknown>>(registerSchema, payload.asset);
        this._channel.publish('persona:newUsername', {
          address: payload.senderAddress.toString('hex'),
          username: registerAsset.username,
        });
      }
      if (payload.moduleID === 5 && payload.assetID === 1) {
        const client = await this.getClient();
        const voteSchema = await getAssetSchema(client, payload.moduleID, payload.assetID);
        const voteAsset = codec.decode<{ votes: { delegateAddress: Buffer; amount: bigint }[] }>(
          voteSchema,
          payload.asset,
        );
        const totalVotesSent: bigint = voteAsset.votes.reduce((a, b) => a + b.amount, BigInt(0));
        this._channel.publish('persona:balanceMinus', {
          address: payload.senderAddress.toString('hex'),
          amount: totalVotesSent.toString(),
        });
      }
      if (payload.moduleID === 2 && payload.assetID === 0) {
        const client = await this.getClient();
        const transferSchema = await getAssetSchema(client, payload.moduleID, payload.assetID);
        const transferAsset = codec.decode<Record<string, unknown>>(transferSchema, payload.asset);
        this._channel.publish('persona:balanceMinus', {
          address: payload.senderAddress.toString('hex'),
          amount: (transferAsset as { amount: bigint }).amount.toString(),
        });
        this._channel.publish('persona:balancePlus', {
          address: (transferAsset.recipientAddress as Buffer).toString('hex'),
          amount: (transferAsset as { amount: bigint }).amount.toString(),
        });
      }
    }
  }

  public async beforeTransactionApply(_input: TransactionApplyContext) {
    // Get any data from stateStore using transaction info, below is an example
    // const sender = await _input.stateStore.account.getOrDefault<TokenAccount>(_input.transaction.senderAddress);
  }

  public async afterTransactionApply(_input: TransactionApplyContext) {
    if (_input.transaction.moduleID === 5 && _input.transaction.assetID === 0) {
      const client = await this.getClient();
      const registerSchema = await getAssetSchema(
        client,
        _input.transaction.moduleID,
        _input.transaction.assetID,
      );
      const registerAsset = codec.decode<Record<string, unknown>>(
        registerSchema,
        _input.transaction.asset,
      );
      const senderAccount = await _input.stateStore.account.getOrDefault<PersonaAccountProps>(
        _input.transaction.senderAddress,
      );
      senderAccount.persona.username = registerAsset.username as string;
      await _input.stateStore.account.set(_input.transaction.senderAddress, senderAccount);
      await setRegisteredUsername(
        _input.stateStore,
        registerAsset.username as string,
        _input.transaction.senderAddress.toString('hex'),
      );
    }
  }

  public async afterGenesisBlockApply(_input: AfterGenesisBlockApplyContext) {
    // Get any data from genesis block, for example get all genesis accounts
    // const genesisAccounts = genesisBlock.header.asset.accounts;
  }
}
