/* eslint-disable class-methods-use-this */

import { BlockHeader } from '@liskhq/lisk-chain';
import {
  AfterBlockApplyContext,
  AfterGenesisBlockApplyContext,
  apiClient,
  BaseModule,
  BeforeBlockApplyContext,
  cryptography,
  Transaction,
  TransactionApplyContext,
} from 'lisk-sdk';
import {
  EngagementActivityChain,
  ProfileActivityChain,
  RedeemableNFTAccountProps,
} from '../../../types/core/account/profile';
import { DeliverSecretProps } from '../../../types/core/asset/redeemable_nft/deliver_secret_asset';
import { LikeCollectionProps } from '../../../types/core/asset/redeemable_nft/like_collection_asset';
import { LikeNFTProps } from '../../../types/core/asset/redeemable_nft/like_nft_asset';
import { MintNFTProps } from '../../../types/core/asset/redeemable_nft/mint_nft_asset';
import {
  MintNFTByQR,
  MintNFTByQRProps,
} from '../../../types/core/asset/redeemable_nft/mint_nft_type_qr_asset';
import { CollectionActivityChain, CollectionAsset } from '../../../types/core/chain/collection';
import { AllCommentAsset, AllLikeAsset } from '../../../types/core/chain/engagement';
import { CollectionIdAsset, NFTIdAsset, TemplateIdAsset } from '../../../types/core/chain/id';
import { NFTAsset } from '../../../types/core/chain/nft';
import { NFTActivityChain } from '../../../types/core/chain/nft/NFTActivity';
import { NFTTemplateAsset } from '../../../types/core/chain/nft/NFTTemplate';
import { CommentCollectionAsset } from './assets/comment_collection_asset';
import { CommentNftAsset } from './assets/comment_nft_asset';
import { CreateOnekindNftAsset } from './assets/create_onekind_nft_asset';
import { DeliverSecretAsset } from './assets/deliver_secret_asset';
import { LikeCollectionAsset } from './assets/like_collection_asset';
import { LikeNftAsset } from './assets/like_nft_asset';
import { MintNftAsset } from './assets/mint_nft_asset';
import { MintNftTypeQrAsset } from './assets/mint_nft_type_qr_asset';
import { BlankNFTTemplate, EnevtiNFTTemplate } from './config/template';
import { ACTIVITY } from './constants/activity';
import { COIN_NAME } from './constants/chain';
import { redeemableNftAccountSchema } from './schemas/account';
import { collectionSchema } from './schemas/chain/collection';
import { nftTemplateSchema } from './schemas/chain/nft_template';
import { redeemableNFTSchema } from './schemas/chain/redeemable_nft';
import {
  accessActivityCollection,
  accessActivityEngagement,
  accessActivityNFT,
  accessActivityProfile,
  addActivityProfile,
} from './utils/activity';
import {
  accessAllCollection,
  accessAllUnavailableCollection,
  accessCollectionById,
  getAllCollection,
  getAllUnavailableCollection,
  getCollectionById,
  isMintingAvailable,
  setAllCollection,
  setAllUnavailableCollection,
} from './utils/collection';
import {
  accessCollectionCommentById,
  accessCollectionLikeById,
  accessNFTCommentById,
  accessNFTLikeById,
} from './utils/engagement';
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
import { addInObject, asyncForEach } from './utils/transaction';

export class RedeemableNftModule extends BaseModule {
  public actions = {
    getNFTLike: async (params): Promise<AllLikeAsset | undefined> => {
      const { id } = params as Record<string, string>;
      const likeNft = await accessNFTLikeById(this._dataAccess, id);
      return likeNft ?? undefined;
    },
    getCollectionLike: async (params): Promise<AllLikeAsset | undefined> => {
      const { id } = params as Record<string, string>;
      const likeCollection = await accessCollectionLikeById(this._dataAccess, id);
      return likeCollection ?? undefined;
    },
    getNFTComment: async (params): Promise<AllCommentAsset | undefined> => {
      const { id } = params as Record<string, string>;
      const commentNft = await accessNFTCommentById(this._dataAccess, id);
      return commentNft ?? undefined;
    },
    getCollectionComment: async (params): Promise<AllCommentAsset | undefined> => {
      const { id } = params as Record<string, string>;
      const commentCollection = await accessCollectionCommentById(this._dataAccess, id);
      return commentCollection ?? undefined;
    },
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
    ): Promise<{ checkpoint: number; version: number; data: CollectionAsset[] }> => {
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
        checkpoint: Number(offset ?? 0) + Number(limit ?? 0),
        version: collections.version,
        data,
      };
    },
    getAllUnavailableCollection: async (
      params,
    ): Promise<{ checkpoint: number; version: number; data: CollectionAsset[] }> => {
      const { offset, limit, version } = params as {
        limit?: number;
        offset?: number;
        version?: number;
      };
      const collections = await accessAllUnavailableCollection(
        this._dataAccess,
        offset,
        limit,
        version,
      );
      const data = await Promise.all(
        collections.allUnavailableCollection.items.map(
          async (item): Promise<CollectionAsset> => {
            const collection = await accessCollectionById(this._dataAccess, item.toString('hex'));
            return collection ?? ((collectionSchema.default as unknown) as CollectionAsset);
          },
        ),
      );
      return {
        checkpoint: Number(offset ?? 0) + Number(limit ?? 0),
        version: collections.version,
        data,
      };
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
    getActivityProfile: async (params): Promise<ProfileActivityChain> => {
      const { address } = params as Record<string, string>;
      const activity = await accessActivityProfile(this._dataAccess, address);
      return activity;
    },
    getActivityEngagement: async (params): Promise<EngagementActivityChain> => {
      const { address } = params as Record<string, string>;
      const activity = await accessActivityEngagement(this._dataAccess, address);
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
    new MintNftTypeQrAsset(),
    new LikeNftAsset(),
    new LikeCollectionAsset(),
    new CommentNftAsset(),
    new CommentCollectionAsset(),
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
    'newActivityProfile',
    'newNFTLike',
    'newCollectionLike',
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
    const allCollection = await getAllCollection(_input.stateStore);
    const allCollectionAsset: CollectionAsset[] = await Promise.all(
      allCollection.items.map(async id => {
        const collection = await getCollectionById(_input.stateStore, id.toString('hex'));
        if (!collection) throw new Error('undefined collection while iterating allCollection');
        return collection;
      }),
    );
    const allUnavailableCollection = await getAllUnavailableCollection(_input.stateStore);
    allCollectionAsset.forEach(collection => {
      if (!isMintingAvailable(collection, _input.block.header.timestamp)) {
        const index = allCollection.items.findIndex(t => Buffer.compare(t, collection.id) === 0);
        if (index === -1) throw new Error('findindex failed in afterblock apply');
        allCollection.items.splice(index, 1);
        allUnavailableCollection.items.unshift(collection.id);
      }
    });
    await setAllCollection(_input.stateStore, allCollection);
    await setAllUnavailableCollection(_input.stateStore, allUnavailableCollection);

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

    const accountWithNewCollection: Set<Buffer> = new Set<Buffer>();
    const accountWithNewPending: Set<Buffer> = new Set<Buffer>();
    const accountWithNewActivity: Set<Buffer> = new Set<Buffer>();
    const pendingNFTBuffer: Set<Buffer> = new Set<Buffer>();
    const collectionWithNewActivity: Set<Buffer> = new Set<Buffer>();
    const collectionWithNewLike: Set<Buffer> = new Set<Buffer>();
    const nftWithNewActivity: Set<Buffer> = new Set<Buffer>();
    const nftWithNewLike: Set<Buffer> = new Set<Buffer>();
    const totalNftMintedInCollection: { [collection: string]: number } = {};
    const totalCollectionCreatedByAddress: { [address: string]: number } = {};

    for (const payload of prevBlock.payload) {
      const senderAddress = cryptography.getAddressFromPublicKey(payload.senderPublicKey);

      // transferAsset
      if (payload.moduleID === 2 && payload.assetID === 0) {
        const transferAsset = (payload.asset as unknown) as {
          amount: bigint;
          recipientAddress: Buffer;
        };

        await addActivityProfile(_input.stateStore, senderAddress.toString('hex'), {
          transaction: payload.id,
          name: ACTIVITY.PROFILE.TOKENSENT,
          date: BigInt(timestampBlock.header.timestamp),
          from: senderAddress,
          to: transferAsset.recipientAddress,
          payload: Buffer.alloc(0),
          value: {
            amount: transferAsset.amount,
            currency: COIN_NAME,
          },
        });
        accountWithNewActivity.add(senderAddress);

        await addActivityProfile(
          _input.stateStore,
          transferAsset.recipientAddress.toString('hex'),
          {
            transaction: payload.id,
            name: ACTIVITY.PROFILE.TOKENRECEIVED,
            date: BigInt(timestampBlock.header.timestamp),
            from: senderAddress,
            to: transferAsset.recipientAddress,
            payload: Buffer.alloc(0),
            value: {
              amount: transferAsset.amount,
              currency: COIN_NAME,
            },
          },
        );
        accountWithNewActivity.add(transferAsset.recipientAddress);
      }

      // registerTransactionAsset
      if (payload.moduleID === 5 && payload.assetID === 0) {
        const registerBaseFee = await _input.reducerHandler.invoke('dynamicBaseFee:getBaseFee', {
          transaction: payload,
        });
        await addActivityProfile(_input.stateStore, senderAddress.toString('hex'), {
          transaction: payload.id,
          name: ACTIVITY.PROFILE.REGISTERUSERNAME,
          date: BigInt(timestampBlock.header.timestamp),
          from: senderAddress,
          to: Buffer.alloc(0),
          payload: Buffer.alloc(0),
          value: {
            amount: registerBaseFee as bigint,
            currency: COIN_NAME,
          },
        });
        accountWithNewActivity.add(senderAddress);
      }

      // voteTransactionAsset
      if (payload.moduleID === 5 && payload.assetID === 1) {
        const voteAsset = (payload.asset as unknown) as {
          votes: { delegateAddress: Buffer; amount: bigint }[];
        };
        await asyncForEach(voteAsset.votes, async item => {
          await addActivityProfile(_input.stateStore, senderAddress.toString('hex'), {
            transaction: payload.id,
            name:
              Buffer.compare(senderAddress, item.delegateAddress) === 0
                ? ACTIVITY.PROFILE.SELFSTAKE
                : ACTIVITY.PROFILE.ADDSTAKE,
            date: BigInt(timestampBlock.header.timestamp),
            from: senderAddress,
            to: item.delegateAddress,
            payload: Buffer.alloc(0),
            value: {
              amount: item.amount,
              currency: COIN_NAME,
            },
          });
        });
        accountWithNewActivity.add(senderAddress);
      }

      // createNftAsset
      if (payload.moduleID === 1000 && payload.assetID === 0) {
        accountWithNewCollection.add(senderAddress);
        accountWithNewActivity.add(senderAddress);
        addInObject(totalCollectionCreatedByAddress, senderAddress, 1);
      }

      // mintNftAsset
      if (payload.moduleID === 1000 && payload.assetID === 1) {
        const mintNFTAsset = (payload.asset as unknown) as MintNFTProps;
        const collection = await getCollectionById(_input.stateStore, mintNFTAsset.id);
        if (!collection) throw new Error('Collection not found in AfterBlockApply hook');

        collectionWithNewActivity.add(collection.id);
        accountWithNewActivity.add(senderAddress);
        addInObject(totalNftMintedInCollection, collection.id, mintNFTAsset.quantity);
      }

      // deliverSecretAsset
      if (payload.moduleID === 1000 && payload.assetID === 2) {
        const deliverSecretAsset = (payload.asset as unknown) as DeliverSecretProps;
        const nft = await getNFTById(_input.stateStore, deliverSecretAsset.id);
        if (!nft) throw new Error('nft id not found in afterBlockApply hook');

        collectionWithNewActivity.add(nft.collectionId);
        nftWithNewActivity.add(nft.id);
        accountWithNewPending.add(nft.creator);
        accountWithNewActivity.add(nft.creator);

        this._channel.publish('redeemableNft:secretDelivered', {
          nft: deliverSecretAsset.id,
        });
      }

      // mintNftTypeQrAsset
      if (payload.moduleID === 1000 && payload.assetID === 3) {
        const mintNFTAsset = (payload.asset as unknown) as MintNFTByQRProps;
        const plainPayload = Buffer.from(mintNFTAsset.body, 'base64').toString();
        const { id, quantity } = JSON.parse(plainPayload) as MintNFTByQR;

        const collection = await getCollectionById(_input.stateStore, id);
        if (!collection) throw new Error('Collection not found in AfterBlockApply hook');

        collectionWithNewActivity.add(collection.id);
        accountWithNewActivity.add(senderAddress);
        addInObject(totalNftMintedInCollection, collection.id, quantity);
      }

      // likeNFtAsset
      if (payload.moduleID === 1000 && payload.assetID === 4) {
        const likeNftAsset = (payload.asset as unknown) as LikeNFTProps;
        nftWithNewLike.add(Buffer.from(likeNftAsset.id, 'hex'));
      }

      // likeCollectionAsset
      if (payload.moduleID === 1000 && payload.assetID === 5) {
        const likeCollectionAsset = (payload.asset as unknown) as LikeCollectionProps;
        collectionWithNewLike.add(Buffer.from(likeCollectionAsset.id, 'hex'));
      }
    }

    await asyncForEach(Object.keys(totalCollectionCreatedByAddress), async address => {
      const account = await _input.stateStore.account.get<RedeemableNFTAccountProps>(
        Buffer.from(address, 'hex'),
      );
      account.redeemableNft.collection
        .slice(0, totalCollectionCreatedByAddress[address])
        .forEach(collection => collectionWithNewActivity.add(collection));
    });

    await asyncForEach(Object.keys(totalNftMintedInCollection), async collectionId => {
      const collection = await getCollectionById(_input.stateStore, collectionId);
      if (!collection) throw new Error('Collection not found in AfterBlockApply hook');

      collection.minted
        .slice(0, totalNftMintedInCollection[collectionId])
        .forEach(nft => nftWithNewActivity.add(nft));

      this._channel.publish('redeemableNft:newNFTMinted', {
        collection: collection.id.toString('hex'),
        quantity: totalNftMintedInCollection[collectionId],
      });

      this._channel.publish('redeemableNft:totalNFTSoldChanged', {
        address: collection.creator.toString('hex'),
      });

      const creatorAccount = await _input.stateStore.account.get<RedeemableNFTAccountProps>(
        collection.creator,
      );
      if (creatorAccount.redeemableNft.pending.length > 0) {
        creatorAccount.redeemableNft.pending.forEach(nft => pendingNFTBuffer.add(nft));
        accountWithNewPending.add(collection.creator);
      }
    });

    if (accountWithNewPending.size > 0) {
      accountWithNewPending.forEach(address =>
        this._channel.publish('redeemableNft:newPendingByAddress', {
          address: address.toString('hex'),
        }),
      );
    }

    if (accountWithNewCollection.size > 0) {
      this._channel.publish('redeemableNft:newCollection');
      accountWithNewCollection.forEach(address =>
        this._channel.publish('redeemableNft:newCollectionByAddress', {
          address: address.toString('hex'),
          count: totalCollectionCreatedByAddress[address.toString('hex')],
        }),
      );
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

    if (accountWithNewActivity.size > 0) {
      accountWithNewActivity.forEach(address =>
        this._channel.publish('redeemableNft:newActivityProfile', {
          address: address.toString('hex'),
          timestamp: timestampBlock.header.timestamp,
        }),
      );
    }

    if (pendingNFTBuffer.size > 0) {
      this._channel.publish('redeemableNft:pendingUtilityDelivery', {
        nfts: [...pendingNFTBuffer],
      });
    }

    if (nftWithNewLike.size > 0) {
      nftWithNewLike.forEach(nft =>
        this._channel.publish('redeemableNft:newNFTLike', { id: nft.toString('hex') }),
      );
    }

    if (collectionWithNewLike.size > 0) {
      collectionWithNewLike.forEach(nft =>
        this._channel.publish('redeemableNft:newCollectionLike', { id: nft.toString('hex') }),
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
