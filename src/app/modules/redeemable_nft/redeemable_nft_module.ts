/* eslint-disable class-methods-use-this */

import {
  AfterBlockApplyContext,
  AfterGenesisBlockApplyContext,
  apiClient,
  BaseModule,
  BeforeBlockApplyContext,
  TransactionApplyContext,
  Transaction,
  cryptography,
} from 'lisk-sdk';
import { BlockHeader } from '@liskhq/lisk-chain';
import { CreateOnekindNftAsset } from './assets/create_onekind_nft_asset';
import { DeliverSecretAsset } from './assets/deliver_secret_asset';
import { MintNftAsset } from './assets/mint_nft_asset';
import { BlankNFTTemplate, EnevtiNFTTemplate } from './config/template';
import { redeemableNftAccountSchema } from './schemas/account';
import {
  accessAllCollection,
  accessCollectionById,
  getCollectionById,
  isMintingAvailable,
} from './utils/collection';
import {
  accessAllNFTTemplate,
  accessAllNFTTemplateGenesis,
  accessNFTTemplateById,
  addNFTTemplateGenesis,
} from './utils/nft_template';
import { accessAllNFT, accessNFTById, getNFTById } from './utils/redeemable_nft';
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
import { MintNFTProps } from '../../../types/core/asset/redeemable_nft/mint_nft_asset';
import { RedeemableNFTAccountProps } from '../../../types/core/account/profile';
import { DeliverSecretProps } from '../../../types/core/asset/redeemable_nft/deliver_secret_asset';

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
      return (await accessAllCollection(this._dataAccess, o, l)).allCollection.items;
    },
    getAllCollection: async (
      params,
    ): Promise<{ offset: number; version: number; data: CollectionAsset[] }> => {
      const { offset, limit, version } = params as {
        limit?: number;
        offset?: number;
        version?: number;
      };
      const collections = await accessAllCollection(this._dataAccess, offset, limit, version);
      const data = await Promise.all(
        collections.allCollection.items.map(
          async (item): Promise<CollectionAsset> => {
            const collection = await accessCollectionById(this._dataAccess, item.toString('hex'));
            return collection ?? ((collectionSchema.default as unknown) as CollectionAsset);
          },
        ),
      );
      return {
        offset: Number(offset ?? 0) + Number(limit ?? 0),
        version: collections.version,
        data,
      };
    },
    getAvailableCollection: async (
      params,
    ): Promise<{ offset: number; version: number; data: CollectionAsset[] }> => {
      const { offset, limit, version } = params as {
        limit?: number;
        offset?: number;
        version?: number;
      };
      const collections = await accessAllCollection(this._dataAccess, offset, undefined, version);
      const availableCollection: CollectionAsset[] = [];
      let index = 0;
      for (const item of collections.allCollection.items) {
        index += 1;
        const collection = await accessCollectionById(this._dataAccess, item.toString('hex'));
        if (collection) {
          const lastBlockHeaders = await this._dataAccess.getLastBlockHeader();
          if (isMintingAvailable(collection, lastBlockHeaders.timestamp)) {
            availableCollection.push(collection);
            if (availableCollection.length === limit) {
              break;
            }
          }
        }
      }
      return { offset: index, version: availableCollection.length, data: availableCollection };
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
    'newCollection',
    'newCollectionByAddress',
    'pendingUtilityDelivery',
    'secretDelivered',
    'totalNFTSoldChanged',
    'newPendingByAddress',
    'newNFTMinted',
    'newActivityCollection',
    'newActivityNFT',
  ];
  public id = 1000;
  public accountSchema = redeemableNftAccountSchema;
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
      header: BlockHeader;
      payload: Transaction[];
    };
    const timestampBlock = (await client.block.get(
      prevBlock.header.previousBlockID.length > 0
        ? prevBlock.header.previousBlockID
        : _input.block.header.previousBlockID,
    )) as {
      header: BlockHeader;
      payload: Transaction[];
    };

    const pendingNFTBuffer: Set<Buffer> = new Set<Buffer>();
    const collectionWithNewActivity: Set<Buffer> = new Set<Buffer>();
    const nftWithNewActivity: Set<Buffer> = new Set<Buffer>();

    for (const payload of prevBlock.payload) {
      const prevBlockSenderAddress = cryptography.getAddressFromPublicKey(payload.senderPublicKey);
      const senderAccount = await _input.stateStore.account.get<RedeemableNFTAccountProps>(
        prevBlockSenderAddress,
      );

      if (payload.moduleID === 1000 && payload.assetID === 0) {
        this._channel.publish('redeemableNft:newCollection');
        this._channel.publish('redeemableNft:newCollectionByAddress', {
          address: prevBlockSenderAddress.toString('hex'),
        });
        collectionWithNewActivity.add(senderAccount.redeemableNft.collection[0]);
      }

      if (payload.moduleID === 1000 && payload.assetID === 1) {
        const mintNFTAsset = (payload.asset as unknown) as MintNFTProps;
        const collection = await getCollectionById(_input.stateStore, mintNFTAsset.id);
        if (!collection) throw new Error('Collection not found in AfterBlockApply hook');

        collectionWithNewActivity.add(collection.id);
        collection.minted
          .slice(0, mintNFTAsset.quantity)
          .forEach(nft => nftWithNewActivity.add(nft));

        this._channel.publish('redeemableNft:newNFTMinted', {
          collection: collection.id.toString('hex'),
          quantity: mintNFTAsset.quantity,
        });

        this._channel.publish('redeemableNft:totalNFTSoldChanged', {
          address: collection.creator.toString('hex'),
        });

        const creatorAccount = await _input.stateStore.account.get<RedeemableNFTAccountProps>(
          collection.creator,
        );
        if (creatorAccount.redeemableNft.pending.length > 0) {
          creatorAccount.redeemableNft.pending.forEach(nft => pendingNFTBuffer.add(nft));
          this._channel.publish('redeemableNft:newPendingByAddress', {
            address: collection.creator.toString('hex'),
          });
        }
      }

      if (payload.moduleID === 1000 && payload.assetID === 2) {
        const deliverSecretAsset = (payload.asset as unknown) as DeliverSecretProps;
        const nft = await getNFTById(_input.stateStore, deliverSecretAsset.id);
        if (!nft) throw new Error('nft id not found in afterBlockApply hook');
        collectionWithNewActivity.add(nft.collectionId);
        nftWithNewActivity.add(nft.id);
        this._channel.publish('redeemableNft:secretDelivered', {
          nft: deliverSecretAsset.id,
        });
      }
    }

    if (collectionWithNewActivity.size > 0) {
      collectionWithNewActivity.forEach(collection =>
        this._channel.publish('redeemableNft:newActivityCollection', {
          collection: collection.toString('hex'),
          timestamp: timestampBlock.header.timestamp,
        }),
      );
    }

    if (nftWithNewActivity.size > 0) {
      nftWithNewActivity.forEach(nft =>
        this._channel.publish('redeemableNft:newActivityNFT', {
          nft: nft.toString('hex'),
          timestamp: timestampBlock.header.timestamp,
        }),
      );
    }

    if (pendingNFTBuffer.size > 0) {
      pendingNFTBuffer.forEach(nft =>
        this._channel.publish('redeemableNft:pendingUtilityDelivery', {
          nft: nft.toString('hex'),
        }),
      );
    }
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
