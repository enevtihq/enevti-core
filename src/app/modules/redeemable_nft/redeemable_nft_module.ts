/* eslint-disable class-methods-use-this */

import {
  AfterBlockApplyContext,
  AfterGenesisBlockApplyContext,
  BaseModule,
  BeforeBlockApplyContext,
  TransactionApplyContext,
  StateStore,
} from 'lisk-sdk';
import { CreateOnekindNftAsset } from './assets/create_onekind_nft_asset';
import { DeliverSecretAsset } from './assets/deliver_secret_asset';
import { MintNftAsset } from './assets/mint_nft_asset';
import { BlankNFTTemplate, EnevtiNFTTemplate } from './config/template';
import { redeemableNftAccountSchema } from './schemas/account';
import { getAllCollection, getCollectionById } from './utils/collection';
import { addNFTTemplate, getAllNFTTemplate, getNFTTemplateById } from './utils/nft_template';
import { getAllNFT, getNFTById } from './utils/redeemable_nft';
import { getRegisteredName, getRegisteredSerial, getRegisteredSymbol } from './utils/registrar';
import { NFTTemplateAsset } from '../../../types/core/chain/nft/NFTTemplate';
import { nftTemplateSchema } from './schemas/chain/nft_template';
import { NFTAsset } from '../../../types/core/chain/nft';
import { redeemableNFTSchema } from './schemas/chain/redeemable_nft';
import { CollectionAsset } from '../../../types/core/chain/collection';
import { collectionSchema } from './schemas/chain/collection';
import { getActivityCollection, getActivityNFT } from './utils/activity';

export class RedeemableNftModule extends BaseModule {
  public actions = {
    // Example below
    // getBalance: async (params) => this._dataAccess.account.get(params.address).token.balance,
    // getBlockByID: async (params) => this._dataAccess.blocks.get(params.id),
  };
  public reducers = {
    getCollectionIdFromName: async (params, stateStore: StateStore) => {
      const { name } = params as Record<string, string>;
      const nameRegistrar = await getRegisteredName(stateStore, name);
      return nameRegistrar ? nameRegistrar.id : undefined;
    },
    getCollectionIdFromSymbol: async (params, stateStore: StateStore) => {
      const { symbol } = params as Record<string, string>;
      const symbolRegistrar = await getRegisteredSymbol(stateStore, symbol);
      return symbolRegistrar ? symbolRegistrar.id : undefined;
    },
    getNFTIdFromSerial: async (params, stateStore: StateStore) => {
      const { serial } = params as Record<string, string>;
      const serialRegistrar = await getRegisteredSerial(stateStore, serial);
      return serialRegistrar ? serialRegistrar.id : undefined;
    },
    getAllCollectionId: async (_, stateStore: StateStore) =>
      (await getAllCollection(stateStore)).items,
    getAllCollection: async (_, stateStore: StateStore) => {
      const collections = await getAllCollection(stateStore);
      return Promise.all(
        collections.items.map(
          async (item): Promise<CollectionAsset> => {
            const collection = await getCollectionById(stateStore, item.toString('hex'));
            return collection ?? ((collectionSchema.default as unknown) as CollectionAsset);
          },
        ),
      );
    },
    getCollection: async (params, stateStore: StateStore) => {
      const { id } = params as Record<string, string>;
      const collection = await getCollectionById(stateStore, id);
      return collection ?? undefined;
    },
    getAllNFTId: async (_, stateStore: StateStore) => (await getAllNFT(stateStore)).items,
    getAllNFTT: async (_, stateStore: StateStore) => {
      const nfts = await getAllNFT(stateStore);
      return Promise.all(
        nfts.items.map(
          async (item): Promise<NFTAsset> => {
            const nft = await getNFTById(stateStore, item.toString('hex'));
            return nft ?? ((redeemableNFTSchema.default as unknown) as NFTAsset);
          },
        ),
      );
    },
    getNFT: async (params, stateStore: StateStore) => {
      const { id } = params as Record<string, string>;
      const nft = await getNFTById(stateStore, id);
      return nft ?? nft;
    },
    getAllNFTTemplateId: async (_, stateStore: StateStore) =>
      (await getAllNFTTemplate(stateStore)).items,
    getAllNFTTemplate: async (_, stateStore: StateStore) => {
      const templates = await getAllNFTTemplate(stateStore);
      return Promise.all(
        templates.items.map(
          async (item): Promise<NFTTemplateAsset> => {
            const template = await getNFTTemplateById(stateStore, item);
            return template ?? (nftTemplateSchema.default as NFTTemplateAsset);
          },
        ),
      );
    },
    getNFTTemplateById: async (params, stateStore: StateStore) => {
      const { id } = params as Record<string, string>;
      const template = await getNFTTemplateById(stateStore, id);
      return template ?? undefined;
    },
    getActivityNFT: async (params, stateStore: StateStore) => {
      const { id } = params as Record<string, string>;
      const activity = await getActivityNFT(stateStore, id);
      return activity ?? activity;
    },
    getActivityCollection: async (params, stateStore: StateStore) => {
      const { id } = params as Record<string, string>;
      const activity = await getActivityCollection(stateStore, id);
      return activity ?? activity;
    },
  };
  public name = 'redeemableNft';
  public transactionAssets = [
    new CreateOnekindNftAsset(),
    new MintNftAsset(),
    new DeliverSecretAsset(),
  ];
  public events = [
    // Example below
    // 'redeemableNft:newBlock',
  ];
  public id = 1000;
  public accountSchema = redeemableNftAccountSchema;

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
  }

  public async afterGenesisBlockApply(_input: AfterGenesisBlockApplyContext) {
    // Get any data from genesis block, for example get all genesis accounts
    // const genesisAccounts = genesisBlock.header.asset.accounts;
    await addNFTTemplate(_input.stateStore, EnevtiNFTTemplate);
    await addNFTTemplate(_input.stateStore, BlankNFTTemplate);
  }
}
