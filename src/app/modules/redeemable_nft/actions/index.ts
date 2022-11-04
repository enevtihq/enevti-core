import { BaseModule, GenesisConfig } from 'lisk-framework';
import {
  RedeemableNFTAccountStatsChain,
  ProfileActivityChain,
  EngagementActivityChain,
} from '../../../../types/core/account/profile';
import { CollectionAsset, CollectionActivityChain } from '../../../../types/core/chain/collection';
import { SocialRaffleGenesisConfig } from '../../../../types/core/chain/config/SocialRaffleGenesisConfig';
import {
  LikeAtAsset,
  CommentAsset,
  CommentAtAsset,
  ReplyAsset,
  ReplyAtAsset,
  CommentClubsAsset,
  CommentClubsAtAsset,
} from '../../../../types/core/chain/engagement';
import { CollectionIdAsset, NFTIdAsset, TemplateIdAsset } from '../../../../types/core/chain/id';
import {
  MomentActivityChain,
  MomentAsset,
  MomentAtAsset,
} from '../../../../types/core/chain/moment';
import { NFTAsset } from '../../../../types/core/chain/nft';
import { NFTActivityChain } from '../../../../types/core/chain/nft/NFTActivity';
import { NFTTemplateAsset } from '../../../../types/core/chain/nft/NFTTemplate';
import { SocialRaffleRecord, SocialRaffleChain } from '../../../../types/core/chain/socialRaffle';
import { collectionSchema } from '../schemas/chain/collection';
import { nftTemplateSchema } from '../schemas/chain/nft_template';
import { redeemableNFTSchema } from '../schemas/chain/redeemable_nft';
import { accessAccountStats } from '../utils/account_stats';
import {
  accessActivityNFT,
  accessActivityCollection,
  accessActivityProfile,
  accessActivityEngagement,
  accessActivityMoment,
} from '../utils/activity';
import {
  accessAllCollection,
  accessCollectionById,
  accessAllUnavailableCollection,
} from '../utils/collection';
import {
  accessLiked,
  accessNFTLikeById,
  accessCollectionLikeById,
  accessCommentLikeById,
  accessReplyLikeById,
  accessCommentById,
  accessNFTCommentById,
  accessCollectionCommentById,
  accessReplyById,
  accessCommentReplyById,
  accessCommentClubsLikeById,
  accessReplyClubsLikeById,
  accessCommentClubsById,
  accessCollectionCommentClubsById,
  accessNftCommentClubsById,
  accessReplyClubsById,
  accessCommentClubsReplyById,
} from '../utils/engagement';
import { accessMomentAt, accessMomentById } from '../utils/moment';
import {
  accessAllNFTTemplate,
  accessNFTTemplateById,
  accessAllNFTTemplateGenesis,
} from '../utils/nft_template';
import { accessAllNFT, accessNFTById } from '../utils/redeemable_nft';
import {
  accessRegisteredName,
  accessRegisteredSymbol,
  accessRegisteredSerial,
} from '../utils/registrar';
import { accessSocialRaffleRecord, accessSocialRaffleState } from '../utils/social_raffle';

export function redeemableNftActions(this: BaseModule) {
  return {
    getLiked: async (params): Promise<0 | 1> => {
      const { id, address } = params as Record<string, string>;
      const liked = await accessLiked(this._dataAccess, id, address);
      return liked;
    },
    getNFTLike: async (params): Promise<LikeAtAsset> => {
      const { id } = params as Record<string, string>;
      const likeNft = await accessNFTLikeById(this._dataAccess, id);
      return likeNft;
    },
    getCollectionLike: async (params): Promise<LikeAtAsset> => {
      const { id } = params as Record<string, string>;
      const likeCollection = await accessCollectionLikeById(this._dataAccess, id);
      return likeCollection;
    },
    getCommentLike: async (params): Promise<LikeAtAsset> => {
      const { id } = params as Record<string, string>;
      const likeComment = await accessCommentLikeById(this._dataAccess, id);
      return likeComment;
    },
    getReplyLike: async (params): Promise<LikeAtAsset> => {
      const { id } = params as Record<string, string>;
      const likeReply = await accessReplyLikeById(this._dataAccess, id);
      return likeReply;
    },
    getCommentClubsLike: async (params): Promise<LikeAtAsset> => {
      const { id } = params as Record<string, string>;
      const likeCommentClubs = await accessCommentClubsLikeById(this._dataAccess, id);
      return likeCommentClubs;
    },
    getReplyClubsLike: async (params): Promise<LikeAtAsset> => {
      const { id } = params as Record<string, string>;
      const likeReplyClubs = await accessReplyClubsLikeById(this._dataAccess, id);
      return likeReplyClubs;
    },
    getComment: async (params): Promise<CommentAsset | undefined> => {
      const { id } = params as Record<string, string>;
      const comment = await accessCommentById(this._dataAccess, id);
      return comment ?? undefined;
    },
    getCommentClubs: async (params): Promise<CommentClubsAsset | undefined> => {
      const { id } = params as Record<string, string>;
      const comment = await accessCommentClubsById(this._dataAccess, id);
      return comment ?? undefined;
    },
    getNFTComment: async (params): Promise<CommentAtAsset | undefined> => {
      const { id } = params as Record<string, string>;
      const commentNft = await accessNFTCommentById(this._dataAccess, id);
      return commentNft;
    },
    getNFTCommentClubs: async (params): Promise<CommentClubsAtAsset | undefined> => {
      const { id } = params as Record<string, string>;
      const commentNft = await accessNftCommentClubsById(this._dataAccess, id);
      return commentNft;
    },
    getCollectionComment: async (params): Promise<CommentAtAsset | undefined> => {
      const { id } = params as Record<string, string>;
      const commentCollection = await accessCollectionCommentById(this._dataAccess, id);
      return commentCollection;
    },
    getCollectionCommentClubs: async (params): Promise<CommentClubsAtAsset | undefined> => {
      const { id } = params as Record<string, string>;
      const commentCollection = await accessCollectionCommentClubsById(this._dataAccess, id);
      return commentCollection;
    },
    getReply: async (params): Promise<ReplyAsset | undefined> => {
      const { id } = params as Record<string, string>;
      const reply = await accessReplyById(this._dataAccess, id);
      return reply ?? undefined;
    },
    getReplyClubs: async (params): Promise<ReplyAsset | undefined> => {
      const { id } = params as Record<string, string>;
      const reply = await accessReplyClubsById(this._dataAccess, id);
      return reply ?? undefined;
    },
    getCommentReply: async (params): Promise<ReplyAtAsset | undefined> => {
      const { id } = params as Record<string, string>;
      const commentReply = await accessCommentReplyById(this._dataAccess, id);
      return commentReply;
    },
    getCommentClubsReply: async (params): Promise<ReplyAtAsset | undefined> => {
      const { id } = params as Record<string, string>;
      const commentReply = await accessCommentClubsReplyById(this._dataAccess, id);
      return commentReply;
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
    getActivityMoment: async (params): Promise<MomentActivityChain> => {
      const { id } = params as Record<string, string>;
      const activity = await accessActivityMoment(this._dataAccess, id);
      return activity;
    },
    getMoment: async (params): Promise<MomentAsset | undefined> => {
      const { id } = params as Record<string, string>;
      const moment = await accessMomentById(this._dataAccess, id);
      return moment ?? undefined;
    },
    getMomentAt: async (params): Promise<MomentAtAsset> => {
      const { id } = params as Record<string, string>;
      const momentAt = await accessMomentAt(this._dataAccess, id);
      return momentAt;
    },
    getActivityCollection: async (params): Promise<CollectionActivityChain> => {
      const { id } = params as Record<string, string>;
      const activity = await accessActivityCollection(this._dataAccess, id);
      return activity;
    },
    getAccountStats: async (params): Promise<RedeemableNFTAccountStatsChain> => {
      const { address } = params as Record<string, string>;
      const accountStats = await accessAccountStats(this._dataAccess, address);
      return accountStats;
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
    getSocialRaffleRecord: async (params): Promise<SocialRaffleRecord> => {
      const { height } = params as { height: number };
      const raffleRecord = await accessSocialRaffleRecord(this._dataAccess, height);
      return raffleRecord ?? { items: [] };
    },
    getSocialRaffleState: async (): Promise<SocialRaffleChain> => {
      const raffleState = await accessSocialRaffleState(this._dataAccess);
      return raffleState;
    },
    // eslint-disable-next-line @typescript-eslint/require-await
    getSocialRaffleConfig: async (): Promise<SocialRaffleGenesisConfig['socialRaffle']> => {
      const { socialRaffle } = this.config as GenesisConfig & SocialRaffleGenesisConfig;
      return socialRaffle;
    },
  };
}
