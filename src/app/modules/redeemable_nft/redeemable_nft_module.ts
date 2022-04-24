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
import { CollectionActivityChain, CollectionAsset } from '../../../types/core/chain/collection';
import { collectionSchema } from './schemas/chain/collection';
import { getActivityCollection, getActivityNFT } from './utils/activity';
import { CollectionIdAsset, NFTIdAsset, TemplateIdAsset } from '../../../types/core/chain/id';
import { NFTActivityChain } from '../../../types/core/chain/nft/NFTActivity';

export class RedeemableNftModule extends BaseModule {
  public actions = {
    // Example below
    // getBalance: async (params) => this._dataAccess.account.get(params.address).token.balance,
    // getBlockByID: async (params) => this._dataAccess.blocks.get(params.id),
  };
  public reducers = {
    getCollectionIdFromName: async (
      params,
      stateStore: StateStore,
    ): Promise<CollectionIdAsset | undefined> => {
      const { name } = params as Record<string, string>;
      const nameRegistrar = await getRegisteredName(stateStore, name);
      return nameRegistrar ? nameRegistrar.id : undefined;
    },
    getCollectionIdFromSymbol: async (
      params,
      stateStore: StateStore,
    ): Promise<CollectionIdAsset | undefined> => {
      const { symbol } = params as Record<string, string>;
      const symbolRegistrar = await getRegisteredSymbol(stateStore, symbol);
      return symbolRegistrar ? symbolRegistrar.id : undefined;
    },
    getNFTIdFromSerial: async (params, stateStore: StateStore): Promise<NFTIdAsset | undefined> => {
      const { serial } = params as Record<string, string>;
      const serialRegistrar = await getRegisteredSerial(stateStore, serial);
      return serialRegistrar ? serialRegistrar.id : undefined;
    },
    getAllCollectionId: async (params, stateStore: StateStore): Promise<CollectionIdAsset[]> => {
      const { offset, limit } = params as { limit?: number; offset?: number };
      const l = limit ?? 10;
      const o = offset ?? 0;
      return (await getAllCollection(stateStore, o, l)).items;
    },
    getAllCollection: async (params, stateStore: StateStore): Promise<CollectionAsset[]> => {
      const { offset, limit } = params as { limit?: number; offset?: number };
      const collections = await getAllCollection(stateStore, offset, limit);
      return Promise.all(
        collections.items.map(
          async (item): Promise<CollectionAsset> => {
            const collection = await getCollectionById(stateStore, item.toString('hex'));
            return collection ?? ((collectionSchema.default as unknown) as CollectionAsset);
          },
        ),
      );
    },
    getCollection: async (params, stateStore: StateStore): Promise<CollectionAsset | undefined> => {
      const { id } = params as Record<string, string>;
      const collection = await getCollectionById(stateStore, id);
      return collection ?? undefined;
    },
    getAllNFTId: async (params, stateStore: StateStore): Promise<NFTIdAsset[]> => {
      const { offset, limit } = params as { limit?: number; offset?: number };
      const l = limit ?? 10;
      const o = offset ?? 0;
      return (await getAllNFT(stateStore, o, l)).items;
    },
    getAllNFT: async (params, stateStore: StateStore): Promise<NFTAsset[]> => {
      const { offset, limit } = params as { limit?: number; offset?: number };
      const nfts = await getAllNFT(stateStore, limit, offset);
      return Promise.all(
        nfts.items.map(
          async (item): Promise<NFTAsset> => {
            const nft = await getNFTById(stateStore, item.toString('hex'));
            return nft ?? ((redeemableNFTSchema.default as unknown) as NFTAsset);
          },
        ),
      );
    },
    getNFT: async (params, stateStore: StateStore): Promise<NFTAsset | undefined> => {
      const { id } = params as Record<string, string>;
      const nft = await getNFTById(stateStore, id);
      return nft ?? undefined;
    },
    getAllNFTTemplateId: async (params, stateStore: StateStore): Promise<TemplateIdAsset[]> => {
      const { offset, limit } = params as { limit?: number; offset?: number };
      const l = limit ?? 10;
      const o = offset ?? 0;
      return (await getAllNFTTemplate(stateStore, o, l)).items;
    },
    getAllNFTTemplate: async (params, stateStore: StateStore): Promise<NFTTemplateAsset[]> => {
      const { offset, limit } = params as { limit?: number; offset?: number };
      const templates = await getAllNFTTemplate(stateStore, offset, limit);
      return Promise.all(
        templates.items.map(
          async (item): Promise<NFTTemplateAsset> => {
            const template = await getNFTTemplateById(stateStore, item);
            return template ?? (nftTemplateSchema.default as NFTTemplateAsset);
          },
        ),
      );
    },
    getNFTTemplateById: async (
      params,
      stateStore: StateStore,
    ): Promise<NFTTemplateAsset | undefined> => {
      const { id } = params as Record<string, string>;
      const template = await getNFTTemplateById(stateStore, id);
      return template ?? undefined;
    },
    getActivityNFT: async (params, stateStore: StateStore): Promise<NFTActivityChain> => {
      const { id } = params as Record<string, string>;
      const activity = await getActivityNFT(stateStore, id);
      return activity;
    },
    getActivityCollection: async (
      params,
      stateStore: StateStore,
    ): Promise<CollectionActivityChain> => {
      const { id } = params as Record<string, string>;
      const activity = await getActivityCollection(stateStore, id);
      return activity;
    },
    isNameExists: async (params, stateStore: StateStore): Promise<boolean> => {
      const { name } = params as Record<string, string>;
      const nameRegistrar = await getRegisteredName(stateStore, name);
      return !!nameRegistrar;
    },
    isSymbolExists: async (params, stateStore: StateStore): Promise<boolean> => {
      const { symbol } = params as Record<string, string>;
      const symbolRegistrar = await getRegisteredSymbol(stateStore, symbol);
      return !!symbolRegistrar;
    },
    isSerialExists: async (params, stateStore: StateStore): Promise<boolean> => {
      const { serial } = params as Record<string, string>;
      const serialRegistrar = await getRegisteredSerial(stateStore, serial);
      return !!serialRegistrar;
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
