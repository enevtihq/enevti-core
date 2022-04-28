/* eslint-disable class-methods-use-this */

import {
  RegisterTransactionAsset,
  RegisterTransactionAssetContext,
} from 'lisk-framework/dist-node/modules/dpos';
import {
  AfterBlockApplyContext,
  AfterGenesisBlockApplyContext,
  BaseModule,
  BeforeBlockApplyContext,
  codec,
  TransactionApplyContext,
} from 'lisk-sdk';
import { PersonaAccountProps } from '../../../types/core/account/persona';
import { RedeemableNFTAccountProps } from '../../../types/core/account/profile';
import { ChangePhotoAsset } from './assets/change_photo_asset';
import { ChangeTwitterAsset } from './assets/change_twitter_asset';
import { personaAccountSchema } from './schema/account';
import { getDefaultAccount } from './utils/account';
import { accessRegisteredUsername, setRegisteredUsername } from './utils/username';

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
  public events = ['newUsername'];
  public id = 1001;
  public accountSchema = personaAccountSchema;

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
      if (payload.moduleID === 5 && payload.assetID === 0) {
        const registerAsset = codec.decode<RegisterTransactionAssetContext>(
          new RegisterTransactionAsset().schema,
          payload.asset,
        );
        this._channel.publish('persona:newUsername', {
          address: payload.senderAddress.toString('hex'),
          username: registerAsset.username,
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
      const registerAsset = codec.decode<RegisterTransactionAssetContext>(
        new RegisterTransactionAsset().schema,
        _input.transaction.asset,
      );
      const senderAccount = await _input.stateStore.account.getOrDefault<PersonaAccountProps>(
        _input.transaction.senderAddress,
      );
      senderAccount.persona.username = registerAsset.username;
      await _input.stateStore.account.set(_input.transaction.senderAddress, senderAccount);
      await setRegisteredUsername(
        _input.stateStore,
        registerAsset.username,
        _input.transaction.senderAddress.toString('hex'),
      );
    }
  }

  public async afterGenesisBlockApply(_input: AfterGenesisBlockApplyContext) {
    // Get any data from genesis block, for example get all genesis accounts
    // const genesisAccounts = genesisBlock.header.asset.accounts;
  }
}
