import { BaseModuleDataAccess } from 'lisk-framework';
import {
  RedeemableNFTAccountStatsChain,
  ProfileActivityChain,
  EngagementActivityChain,
} from '../../../../types/core/account/profile';
import { CollectionAsset, CollectionActivityChain } from '../../../../types/core/chain/collection';
import {
  CommentAsset,
  CommentAtAsset,
  LikeAtAsset,
  ReplyAsset,
  ReplyAtAsset,
} from '../../../../types/core/chain/engagement';
import { CollectionIdAsset, NFTIdAsset, TemplateIdAsset } from '../../../../types/core/chain/id';
import { NFTAsset } from '../../../../types/core/chain/nft';
import { NFTActivityChain } from '../../../../types/core/chain/nft/NFTActivity';
import { NFTTemplateAsset } from '../../../../types/core/chain/nft/NFTTemplate';
import { collectionSchema } from '../schemas/chain/collection';
import { nftTemplateSchema } from '../schemas/chain/nft_template';
import { redeemableNFTSchema } from '../schemas/chain/redeemable_nft';
import { accessAccountStats } from '../utils/account_stats';
import {
  accessActivityNFT,
  accessActivityCollection,
  accessActivityProfile,
  accessActivityEngagement,
} from '../utils/activity';
import {
  accessAllCollection,
  accessCollectionById,
  accessAllUnavailableCollection,
} from '../utils/collection';
import {
  accessCollectionCommentById,
  accessCollectionLikeById,
  accessCommentById,
  accessCommentLikeById,
  accessCommentReplyById,
  accessLiked,
  accessNFTCommentById,
  accessNFTLikeById,
  accessReplyById,
  accessReplyLikeById,
} from '../utils/engagement';
import {
  accessAllNFTTemplate,
  accessNFTTemplateById,
  accessAllNFTTemplateGenesis,
} from '../utils/nft_template';
import { accessAllNFT, accessNFTById } from '../utils/redeemable_nft';
import {
  accessRegisteredName,
  accessRegisteredSerial,
  accessRegisteredSymbol,
} from '../utils/registrar';

export default function redeemableNftAction(dataAccess: BaseModuleDataAccess) {
  return {
    getLiked: async (params): Promise<0 | 1> => {
      const { id, address } = params as Record<string, string>;
      const liked = await accessLiked(dataAccess, id, address);
      return liked;
    },
    getNFTLike: async (params): Promise<LikeAtAsset | undefined> => {
      const { id } = params as Record<string, string>;
      const likeNft = await accessNFTLikeById(dataAccess, id);
      return likeNft ?? undefined;
    },
    getCollectionLike: async (params): Promise<LikeAtAsset | undefined> => {
      const { id } = params as Record<string, string>;
      const likeCollection = await accessCollectionLikeById(dataAccess, id);
      return likeCollection ?? undefined;
    },
    getCommentLike: async (params): Promise<LikeAtAsset | undefined> => {
      const { id } = params as Record<string, string>;
      const likeComment = await accessCommentLikeById(dataAccess, id);
      return likeComment ?? undefined;
    },
    getReplyLike: async (params): Promise<LikeAtAsset | undefined> => {
      const { id } = params as Record<string, string>;
      const likeReply = await accessReplyLikeById(dataAccess, id);
      return likeReply ?? undefined;
    },
    getComment: async (params): Promise<CommentAsset | undefined> => {
      const { id } = params as Record<string, string>;
      const comment = await accessCommentById(dataAccess, id);
      return comment ?? undefined;
    },
    getNFTComment: async (params): Promise<CommentAtAsset | undefined> => {
      const { id } = params as Record<string, string>;
      const commentNft = await accessNFTCommentById(dataAccess, id);
      return commentNft ?? undefined;
    },
    getCollectionComment: async (params): Promise<CommentAtAsset | undefined> => {
      const { id } = params as Record<string, string>;
      const commentCollection = await accessCollectionCommentById(dataAccess, id);
      return commentCollection ?? undefined;
    },
    getReply: async (params): Promise<ReplyAsset | undefined> => {
      const { id } = params as Record<string, string>;
      const reply = await accessReplyById(dataAccess, id);
      return reply ?? undefined;
    },
    getCommentReply: async (params): Promise<ReplyAtAsset | undefined> => {
      const { id } = params as Record<string, string>;
      const commentReply = await accessCommentReplyById(dataAccess, id);
      return commentReply ?? undefined;
    },
    getCollectionIdFromName: async (params): Promise<CollectionIdAsset | undefined> => {
      const { name } = params as Record<string, string>;
      const nameRegistrar = await accessRegisteredName(dataAccess, name);
      return nameRegistrar ? nameRegistrar.id : undefined;
    },
    getCollectionIdFromSymbol: async (params): Promise<CollectionIdAsset | undefined> => {
      const { symbol } = params as Record<string, string>;
      const symbolRegistrar = await accessRegisteredSymbol(dataAccess, symbol);
      return symbolRegistrar ? symbolRegistrar.id : undefined;
    },
    getNFTIdFromSerial: async (params): Promise<NFTIdAsset | undefined> => {
      const { serial } = params as Record<string, string>;
      const serialRegistrar = await accessRegisteredSerial(dataAccess, serial);
      return serialRegistrar ? serialRegistrar.id : undefined;
    },
    getAllCollectionId: async (params): Promise<CollectionIdAsset[]> => {
      const { offset, limit } = params as { limit?: number; offset?: number };
      const l = limit ?? 10;
      const o = offset ?? 0;
      return (await accessAllCollection(dataAccess, o, l)).allCollection.items;
    },
    getAllCollection: async (
      params,
    ): Promise<{ checkpoint: number; version: number; data: CollectionAsset[] }> => {
      const { offset, limit, version } = params as {
        limit?: number;
        offset?: number;
        version?: number;
      };
      const collections = await accessAllCollection(dataAccess, offset, limit, version);
      const data = await Promise.all(
        collections.allCollection.items.map(
          async (item): Promise<CollectionAsset> => {
            const collection = await accessCollectionById(dataAccess, item.toString('hex'));
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
      const collections = await accessAllUnavailableCollection(dataAccess, offset, limit, version);
      const data = await Promise.all(
        collections.allUnavailableCollection.items.map(
          async (item): Promise<CollectionAsset> => {
            const collection = await accessCollectionById(dataAccess, item.toString('hex'));
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
      const collection = await accessCollectionById(dataAccess, id);
      return collection ?? undefined;
    },
    getAllNFTId: async (params): Promise<NFTIdAsset[]> => {
      const { offset, limit } = params as { limit?: number; offset?: number };
      const l = limit ?? 10;
      const o = offset ?? 0;
      return (await accessAllNFT(dataAccess, o, l)).items;
    },
    getAllNFT: async (params): Promise<NFTAsset[]> => {
      const { offset, limit } = params as { limit?: number; offset?: number };
      const nfts = await accessAllNFT(dataAccess, limit, offset);
      return Promise.all(
        nfts.items.map(
          async (item): Promise<NFTAsset> => {
            const nft = await accessNFTById(dataAccess, item.toString('hex'));
            return nft ?? ((redeemableNFTSchema.default as unknown) as NFTAsset);
          },
        ),
      );
    },
    getNFT: async (params): Promise<NFTAsset | undefined> => {
      const { id } = params as Record<string, string>;
      const nft = await accessNFTById(dataAccess, id);
      return nft ?? undefined;
    },
    getAllNFTTemplateId: async (params): Promise<TemplateIdAsset[]> => {
      const { offset, limit } = params as { limit?: number; offset?: number };
      const l = limit ?? 10;
      const o = offset ?? 0;
      return (await accessAllNFTTemplate(dataAccess, o, l)).items;
    },
    getAllNFTTemplate: async (params): Promise<NFTTemplateAsset[]> => {
      const { offset, limit } = params as { limit?: number; offset?: number };
      const templates = await accessAllNFTTemplate(dataAccess, offset, limit);
      return Promise.all(
        templates.items.map(
          async (item): Promise<NFTTemplateAsset> => {
            const template = await accessNFTTemplateById(dataAccess, item);
            return template ?? (nftTemplateSchema.default as NFTTemplateAsset);
          },
        ),
      );
    },
    getAllNFTTemplateGenesisId: async (params): Promise<TemplateIdAsset[]> => {
      const { offset, limit } = params as { limit?: number; offset?: number };
      const l = limit ?? 10;
      const o = offset ?? 0;
      return (await accessAllNFTTemplateGenesis(dataAccess, o, l)).items;
    },
    getAllNFTTemplateGenesis: async (params): Promise<NFTTemplateAsset[]> => {
      const { offset, limit } = params as { limit?: number; offset?: number };
      const templates = await accessAllNFTTemplateGenesis(dataAccess, offset, limit);
      return Promise.all(
        templates.items.map(
          async (item): Promise<NFTTemplateAsset> => {
            const template = await accessNFTTemplateById(dataAccess, item);
            return template ?? (nftTemplateSchema.default as NFTTemplateAsset);
          },
        ),
      );
    },
    getNFTTemplateById: async (params): Promise<NFTTemplateAsset | undefined> => {
      const { id } = params as Record<string, string>;
      const template = await accessNFTTemplateById(dataAccess, id);
      return template ?? undefined;
    },
    getActivityNFT: async (params): Promise<NFTActivityChain> => {
      const { id } = params as Record<string, string>;
      const activity = await accessActivityNFT(dataAccess, id);
      return activity;
    },
    getActivityCollection: async (params): Promise<CollectionActivityChain> => {
      const { id } = params as Record<string, string>;
      const activity = await accessActivityCollection(dataAccess, id);
      return activity;
    },
    getAccountStats: async (params): Promise<RedeemableNFTAccountStatsChain> => {
      const { address } = params as Record<string, string>;
      const accountStats = await accessAccountStats(dataAccess, address);
      return accountStats;
    },
    getActivityProfile: async (params): Promise<ProfileActivityChain> => {
      const { address } = params as Record<string, string>;
      const activity = await accessActivityProfile(dataAccess, address);
      return activity;
    },
    getActivityEngagement: async (params): Promise<EngagementActivityChain> => {
      const { address } = params as Record<string, string>;
      const activity = await accessActivityEngagement(dataAccess, address);
      return activity;
    },
    isNameExists: async (params): Promise<boolean> => {
      const { name } = params as Record<string, string>;
      const nameRegistrar = await accessRegisteredName(dataAccess, name);
      return !!nameRegistrar;
    },
    isSymbolExists: async (params): Promise<boolean> => {
      const { symbol } = params as Record<string, string>;
      const symbolRegistrar = await accessRegisteredSymbol(dataAccess, symbol);
      return !!symbolRegistrar;
    },
    isSerialExists: async (params): Promise<boolean> => {
      const { serial } = params as Record<string, string>;
      const serialRegistrar = await accessRegisteredSerial(dataAccess, serial);
      return !!serialRegistrar;
    },
  };
}
