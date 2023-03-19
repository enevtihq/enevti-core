/* eslint-disable class-methods-use-this */

import {
  AfterBlockApplyContext,
  AfterGenesisBlockApplyContext,
  BaseModule,
  BeforeBlockApplyContext,
  codec,
  TransactionApplyContext,
  cryptography,
} from 'lisk-sdk';
import { RegisterTransactionAsset } from 'lisk-framework/dist-node/modules/dpos';
import { TransferAsset } from 'lisk-framework/dist-node/modules/token';
import { PersonaAccountProps } from 'enevti-types/account/persona';
import { AccountChain, RedeemableNFTAccountProps } from 'enevti-types/account/profile';
import { AddActivityParam } from 'enevti-types/param/activity';
import { ChangePhotoAsset } from './assets/change_photo_asset';
import { ChangeTwitterAsset } from './assets/change_twitter_asset';
import { personaAccountSchema } from './schema/account';
import { getDefaultAccount } from './utils/account';

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
  };
  public reducers = {};
  public name = 'persona';
  public transactionAssets = [new ChangePhotoAsset(), new ChangeTwitterAsset()];
  public events = ['usernameChanged', 'balanceChanged'];
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
      const prevBlockSenderAddress = cryptography.getAddressFromPublicKey(payload.senderPublicKey);
      this._channel.publish('persona:balanceChanged', {
        address: prevBlockSenderAddress.toString('hex'),
      });
      if (payload.moduleID === 5 && payload.assetID === 0) {
        this._channel.publish('persona:usernameChanged', {
          address: prevBlockSenderAddress.toString('hex'),
        });
      }
      if (payload.moduleID === 2 && payload.assetID === 0) {
        const transferAsset = codec.decode<{
          amount: bigint;
          recipientAddress: Buffer;
        }>(new TransferAsset(BigInt(0)).schema, payload.asset);
        this._channel.publish('persona:balanceChanged', {
          address: transferAsset.recipientAddress.toString('hex'),
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
      const registerAsset = codec.decode<Record<string, unknown>>(
        new RegisterTransactionAsset().schema,
        _input.transaction.asset,
      );
      const senderAccount = await _input.stateStore.account.getOrDefault<PersonaAccountProps>(
        _input.transaction.senderAddress,
      );
      senderAccount.persona.username = registerAsset.username as string;
      await _input.stateStore.account.set(_input.transaction.senderAddress, senderAccount);
      await _input.reducerHandler.invoke('registrar:setRegistrar', {
        identifier: 'username',
        value: registerAsset.username as string,
        id: _input.transaction.senderAddress,
      });

      const registerBaseFee = await _input.reducerHandler.invoke<bigint>(
        'dynamicBaseFee:getBaseFee',
        { transaction: { moduleID: 5, assetID: 0 } },
      );
      const oldState = await _input.reducerHandler.invoke<AccountChain>('activity:getAccount', {
        address: _input.transaction.senderAddress.toString('hex'),
      });
      const newState = { ...oldState };
      newState.dpos.delegate.username = registerAsset.username as string;
      await _input.reducerHandler.invoke('activity:addActivity', {
        key: `profile:${_input.transaction.senderAddress.toString('hex')}`,
        type: 'registerUsername',
        transaction: _input.transaction.id,
        amount: registerBaseFee,
        state: {
          old: oldState,
          new: newState,
        },
      } as AddActivityParam);
    }
  }

  public async afterGenesisBlockApply(_input: AfterGenesisBlockApplyContext) {
    // Get any data from genesis block, for example get all genesis accounts
    // const genesisAccounts = genesisBlock.header.asset.accounts;
  }
}
