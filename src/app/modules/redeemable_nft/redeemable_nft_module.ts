/* eslint-disable class-methods-use-this */

import {
  AfterBlockApplyContext,
  AfterGenesisBlockApplyContext,
  BaseModule,
  BeforeBlockApplyContext,
  TransactionApplyContext,
} from 'lisk-sdk';
import { CreateOnekindNftAsset } from './assets/create_onekind_nft_asset';
import { DeliverSecretAsset } from './assets/deliver_secret_asset';
import { MintNftAsset } from './assets/mint_nft_asset';
import { BlankNFTTemplate, EnevtiNFTTemplate } from './config/template';
import { redeemableNftAccountSchema } from './schemas/account';
import { accessAllCollection, accessCollectionById } from './utils/collection';
import {
  accessAllNFTTemplate,
  accessAllNFTTemplateGenesis,
  accessNFTTemplateById,
  addNFTTemplateGenesis,
} from './utils/nft_template';
import { accessAllNFT, accessNFTById } from './utils/redeemable_nft';
import {
  accessRegisteredName,
  accessRegisteredSerial,
  accessRegisteredSymbol,
} from './utils/registrar';
import { NFTTemplateAsset } from '../../../types/core/chain/nft/NFTTemplate';
import { nftTemplateSchema } from './schemas/chain/nft_template';
import { NFTAsset } from '../../../types/core/chain/nft';
import { redeemableNFTSchema } from './schemas/chain/redeemable_nft';
import { CollectionActivityChain, CollectionAsset } from '../../../types/core/chain/collection';
import { collectionSchema } from './schemas/chain/collection';
import { accessActivityCollection, accessActivityNFT } from './utils/activity';
import { CollectionIdAsset, NFTIdAsset, TemplateIdAsset } from '../../../types/core/chain/id';
import { NFTActivityChain } from '../../../types/core/chain/nft/NFTActivity';

export class RedeemableNftModule extends BaseModule {
  public actions = {
    getCollectionIdFromName: async (params): Promise<CollectionIdAsset | undefined> => {
      const { name } = params as Record<string, string>;
      const nameRegistrar = await accessRegisteredName(this._dataAccess, name);
      return nameRegistrar ? nameRegistrar.id : undefined;
    },
    getCollectionIdFromSymbol: async (params): Promise<CollectionIdAsset | undefined> => {
      const { symbol } = params as Record<string, string>;
      const symbolRegistrar = await accessRegisteredSymbol(this._dataAccess, symbol);
      return symbolRegistrar ? symbolRegistrar.id : undefined;
    },
    getNFTIdFromSerial: async (params): Promise<NFTIdAsset | undefined> => {
      const { serial } = params as Record<string, string>;
      const serialRegistrar = await accessRegisteredSerial(this._dataAccess, serial);
      return serialRegistrar ? serialRegistrar.id : undefined;
    },
    getAllCollectionId: async (params): Promise<CollectionIdAsset[]> => {
      const { offset, limit } = params as { limit?: number; offset?: number };
      const l = limit ?? 10;
      const o = offset ?? 0;
      return (await accessAllCollection(this._dataAccess, o, l)).items;
    },
    getAllCollection: async (params): Promise<CollectionAsset[]> => {
      const { offset, limit } = params as { limit?: number; offset?: number };
      const collections = await accessAllCollection(this._dataAccess, offset, limit);
      return Promise.all(
        collections.items.map(
          async (item): Promise<CollectionAsset> => {
            const collection = await accessCollectionById(this._dataAccess, item.toString('hex'));
            return collection ?? ((collectionSchema.default as unknown) as CollectionAsset);
          },
        ),
      );
    },
    getCollection: async (params): Promise<CollectionAsset | undefined> => {
      const { id } = params as Record<string, string>;
      const collection = await accessCollectionById(this._dataAccess, id);
      return collection ?? undefined;
    },
    getAllNFTId: async (params): Promise<NFTIdAsset[]> => {
      const { offset, limit } = params as { limit?: number; offset?: number };
      const l = limit ?? 10;
      const o = offset ?? 0;
      return (await accessAllNFT(this._dataAccess, o, l)).items;
    },
    getAllNFT: async (params): Promise<NFTAsset[]> => {
      const { offset, limit } = params as { limit?: number; offset?: number };
      const nfts = await accessAllNFT(this._dataAccess, limit, offset);
      return Promise.all(
        nfts.items.map(
          async (item): Promise<NFTAsset> => {
            const nft = await accessNFTById(this._dataAccess, item.toString('hex'));
            return nft ?? ((redeemableNFTSchema.default as unknown) as NFTAsset);
          },
        ),
      );
    },
    getNFT: async (params): Promise<NFTAsset | undefined> => {
      const { id } = params as Record<string, string>;
      const nft = await accessNFTById(this._dataAccess, id);
      return nft ?? undefined;
    },
    getAllNFTTemplateId: async (params): Promise<TemplateIdAsset[]> => {
      const { offset, limit } = params as { limit?: number; offset?: number };
      const l = limit ?? 10;
      const o = offset ?? 0;
      return (await accessAllNFTTemplate(this._dataAccess, o, l)).items;
    },
    getAllNFTTemplate: async (params): Promise<NFTTemplateAsset[]> => {
      const { offset, limit } = params as { limit?: number; offset?: number };
      const templates = await accessAllNFTTemplate(this._dataAccess, offset, limit);
      return Promise.all(
        templates.items.map(
          async (item): Promise<NFTTemplateAsset> => {
            const template = await accessNFTTemplateById(this._dataAccess, item);
            return template ?? (nftTemplateSchema.default as NFTTemplateAsset);
          },
        ),
      );
    },
    getAllNFTTemplateGenesisId: async (params): Promise<TemplateIdAsset[]> => {
      const { offset, limit } = params as { limit?: number; offset?: number };
      const l = limit ?? 10;
      const o = offset ?? 0;
      return (await accessAllNFTTemplateGenesis(this._dataAccess, o, l)).items;
    },
    getAllNFTTemplateGenesis: async (params): Promise<NFTTemplateAsset[]> => {
      const { offset, limit } = params as { limit?: number; offset?: number };
      const templates = await accessAllNFTTemplateGenesis(this._dataAccess, offset, limit);
      return Promise.all(
        templates.items.map(
          async (item): Promise<NFTTemplateAsset> => {
            const template = await accessNFTTemplateById(this._dataAccess, item);
            return template ?? (nftTemplateSchema.default as NFTTemplateAsset);
          },
        ),
      );
    },
    getNFTTemplateById: async (params): Promise<NFTTemplateAsset | undefined> => {
      const { id } = params as Record<string, string>;
      const template = await accessNFTTemplateById(this._dataAccess, id);
      return template ?? undefined;
    },
    getActivityNFT: async (params): Promise<NFTActivityChain> => {
      const { id } = params as Record<string, string>;
      const activity = await accessActivityNFT(this._dataAccess, id);
      return activity;
    },
    getActivityCollection: async (params): Promise<CollectionActivityChain> => {
      const { id } = params as Record<string, string>;
      const activity = await accessActivityCollection(this._dataAccess, id);
      return activity;
    },
    isNameExists: async (params): Promise<boolean> => {
      const { name } = params as Record<string, string>;
      const nameRegistrar = await accessRegisteredName(this._dataAccess, name);
      return !!nameRegistrar;
    },
    isSymbolExists: async (params): Promise<boolean> => {
      const { symbol } = params as Record<string, string>;
      const symbolRegistrar = await accessRegisteredSymbol(this._dataAccess, symbol);
      return !!symbolRegistrar;
    },
    isSerialExists: async (params): Promise<boolean> => {
      const { serial } = params as Record<string, string>;
      const serialRegistrar = await accessRegisteredSerial(this._dataAccess, serial);
      return !!serialRegistrar;
    },
  };
  public reducers = {};
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
    await addNFTTemplateGenesis(_input.stateStore, EnevtiNFTTemplate);
    await addNFTTemplateGenesis(_input.stateStore, BlankNFTTemplate);
  }
}
