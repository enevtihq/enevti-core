import { BaseChannel } from 'lisk-framework';
import { RedeemableNFTAccountStatsChain } from 'enevti-types/account/profile';
import { CollectionAsset } from 'enevti-types/chain/collection';
import { SocialRaffleGenesisConfig } from 'enevti-types/chain/config/SocialRaffleGenesisConfig';
import { LikeAtAsset } from 'enevti-types/chain/engagement';
import { CollectionIdAsset, NFTIdAsset, TemplateIdAsset } from 'enevti-types/chain/id';
import { MomentAsset, MomentAtAsset } from 'enevti-types/chain/moment';
import { NFTAsset } from 'enevti-types/chain/nft';
import { NFTTemplateAsset } from 'enevti-types/chain/nft/NFTTemplate';
import { SocialRaffleChain, SocialRaffleBlockRecord } from 'enevti-types/chain/social_raffle';

export const invokeGetAllCollectionId = async (
  channel: BaseChannel,
  offset: number,
  limit: number,
): Promise<CollectionIdAsset[]> =>
  channel.invoke('redeemableNft:getAllCollectionId', { offset, limit });

export const invokeGetAllCollection = async (
  channel: BaseChannel,
  offset?: number,
  limit?: number,
  version?: number,
): Promise<{ checkpoint: number; version: number; data: CollectionAsset[] }> =>
  channel.invoke('redeemableNft:getAllCollection', { offset, limit, version });

export const invokeGetAllMoment = async (
  channel: BaseChannel,
  offset?: number,
  limit?: number,
  version?: number,
): Promise<{ checkpoint: number; version: number; data: MomentAsset[] }> =>
  channel.invoke('redeemableNft:getAllMoment', { offset, limit, version });

export const invokeGetUnavailableCollection = async (
  channel: BaseChannel,
  offset?: number,
  limit?: number,
  version?: number,
): Promise<{ checkpoint: number; version: number; data: CollectionAsset[] }> =>
  channel.invoke('redeemableNft:getUnavailableCollection', { offset, limit, version });

export const invokeGetCollection = async (
  channel: BaseChannel,
  id: string,
): Promise<CollectionAsset | undefined> => channel.invoke('redeemableNft:getCollection', { id });

export const invokeGetLiked = async (
  channel: BaseChannel,
  id: string,
  address: string,
): Promise<0 | 1> => channel.invoke('redeemableNft:getLiked', { id, address });

export const invokeGetNFTLike = async (channel: BaseChannel, id: string): Promise<LikeAtAsset> =>
  channel.invoke('redeemableNft:getNFTLike', { id });

export const invokeGetMomentLike = async (channel: BaseChannel, id: string): Promise<LikeAtAsset> =>
  channel.invoke('redeemableNft:getMomentLike', { id });

export const invokeGetCollectionLike = async (
  channel: BaseChannel,
  id: string,
): Promise<LikeAtAsset> => channel.invoke('redeemableNft:getCollectionLike', { id });

export const invokeGetCommentLike = async (
  channel: BaseChannel,
  id: string,
): Promise<LikeAtAsset> => channel.invoke('redeemableNft:getCommentLike', { id });

export const invokeGetReplyLike = async (channel: BaseChannel, id: string): Promise<LikeAtAsset> =>
  channel.invoke('redeemableNft:getReplyLike', { id });

export const invokeGetCommentClubsLike = async (
  channel: BaseChannel,
  id: string,
): Promise<LikeAtAsset> => channel.invoke('redeemableNft:getCommentClubsLike', { id });

export const invokeGetReplyClubsLike = async (
  channel: BaseChannel,
  id: string,
): Promise<LikeAtAsset> => channel.invoke('redeemableNft:getReplyClubsLike', { id });

export const invokeGetAllNFTId = async (
  channel: BaseChannel,
  offset: number,
  limit: number,
): Promise<NFTIdAsset[]> => channel.invoke('redeemableNft:getAllNFTId', { offset, limit });

export const invokeGetAllNFT = async (
  channel: BaseChannel,
  offset: number,
  limit: number,
): Promise<NFTAsset[]> => channel.invoke('redeemableNft:getAllNFT', { offset, limit });

export const invokeGetNFT = async (
  channel: BaseChannel,
  id: string,
): Promise<NFTAsset | undefined> => channel.invoke('redeemableNft:getNFT', { id });

export const invokeGetAllNFTTemplateGenesisId = async (
  channel: BaseChannel,
  offset: number,
  limit: number,
): Promise<TemplateIdAsset[]> =>
  channel.invoke('redeemableNft:getAllNFTTemplateGenesisId', { offset, limit });

export const invokeGetAllNFTTemplateGenesis = async (
  channel: BaseChannel,
  offset: number,
  limit: number,
): Promise<NFTTemplateAsset[]> =>
  channel.invoke('redeemableNft:getAllNFTTemplateGenesis', { offset, limit });

export const invokeGetAllNFTTemplateId = async (
  channel: BaseChannel,
  offset: number,
  limit: number,
): Promise<TemplateIdAsset[]> =>
  channel.invoke('redeemableNft:getAllNFTTemplateId', { offset, limit });

export const invokeGetAllNFTTemplate = async (
  channel: BaseChannel,
  offset: number,
  limit: number,
): Promise<NFTTemplateAsset[]> =>
  channel.invoke('redeemableNft:getAllNFTTemplate', { offset, limit });

export const invokeGetNFTTemplateById = async (
  channel: BaseChannel,
  id: string,
): Promise<NFTTemplateAsset | undefined> =>
  channel.invoke('redeemableNft:getNFTTemplateById', { id });

export const invokeGetMoment = async (
  channel: BaseChannel,
  id: string,
): Promise<MomentAsset | undefined> => channel.invoke('redeemableNft:getMoment', { id });

export const invokeGetMomentAt = async (channel: BaseChannel, id: string): Promise<MomentAtAsset> =>
  channel.invoke('redeemableNft:getMomentAt', { id });

export const invokeGetAccountStats = async (
  channel: BaseChannel,
  address: string,
): Promise<RedeemableNFTAccountStatsChain> =>
  channel.invoke('redeemableNft:getAccountStats', { address });

export const invokeGetSocialRaffleRecord = async (
  channel: BaseChannel,
  height: number,
): Promise<SocialRaffleRecord> => channel.invoke('redeemableNft:getSocialRaffleRecord', { height });

export const invokeGetSocialRaffleState = async (
  channel: BaseChannel,
): Promise<SocialRaffleChain> => channel.invoke('redeemableNft:getSocialRaffleState');

export const invokeGetSocialRaffleConfig = async (
  channel: BaseChannel,
): Promise<SocialRaffleGenesisConfig['socialRaffle']> =>
  channel.invoke('redeemableNft:getSocialRaffleConfig');
