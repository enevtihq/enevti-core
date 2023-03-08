import { BaseModule, GenesisConfig } from 'lisk-framework';
import { CollectionAsset } from 'enevti-types/chain/collection';
import { SocialRaffleGenesisConfig } from 'enevti-types/chain/config/SocialRaffleGenesisConfig';
import { CollectionIdAsset, NFTIdAsset, TemplateIdAsset } from 'enevti-types/chain/id';
import { MomentAsset, MomentAtAsset } from 'enevti-types/chain/moment';
import { NFTAsset } from 'enevti-types/chain/nft';
import { NFTTemplateAsset } from 'enevti-types/chain/nft/NFTTemplate';
import { SocialRaffleRecord, SocialRaffleChain } from 'enevti-types/chain/social_raffle';
import { collectionSchema } from '../schemas/chain/collection';
import { momentSchema } from '../schemas/chain/moment';
import { nftTemplateSchema } from '../schemas/chain/nft_template';
import { redeemableNFTSchema } from '../schemas/chain/redeemable_nft';
import {
  accessAllCollection,
  accessCollectionById,
  accessAllUnavailableCollection,
} from '../utils/collection';
import { accessAllMoment, accessMomentAt, accessMomentById } from '../utils/moment';
import {
  accessAllNFTTemplate,
  accessNFTTemplateById,
  accessAllNFTTemplateGenesis,
} from '../utils/nft_template';
import { accessAllNFT, accessNFTById } from '../utils/redeemable_nft';
import { accessSocialRaffleRecord, accessSocialRaffleState } from '../utils/social_raffle';

export function redeemableNftActions(this: BaseModule) {
  return {
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
    getAllMoment: async (
      params,
    ): Promise<{ checkpoint: number; version: number; data: MomentAsset[] }> => {
      const { offset, limit, version } = params as {
        limit?: number;
        offset?: number;
        version?: number;
      };
      const moments = await accessAllMoment(this._dataAccess, offset, limit, version);
      const data = await Promise.all(
        moments.allMoment.items.map(
          async (item): Promise<MomentAsset> => {
            const moment = await accessMomentById(this._dataAccess, item.toString('hex'));
            return moment ?? ((momentSchema.default as unknown) as MomentAsset);
          },
        ),
      );
      return {
        checkpoint: Number(offset ?? 0) + Number(limit ?? 0),
        version: moments.version,
        data,
      };
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
