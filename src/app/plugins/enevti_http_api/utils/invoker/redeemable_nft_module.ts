import { BaseChannel } from 'lisk-framework';
import {
  EngagementActivityChain,
  ProfileActivityChain,
  RedeemableNFTAccountStatsChain,
} from '../../../../../types/core/account/profile';
import {
  CollectionActivityChain,
  CollectionAsset,
} from '../../../../../types/core/chain/collection';
import { SocialRaffleGenesisConfig } from '../../../../../types/core/chain/config/SocialRaffleGenesisConfig';
import {
  CommentAsset,
  CommentAtAsset,
  CommentClubsAsset,
  CommentClubsAtAsset,
  LikeAtAsset,
  ReplyAsset,
  ReplyAtAsset,
} from '../../../../../types/core/chain/engagement';
import { CollectionIdAsset, NFTIdAsset, TemplateIdAsset } from '../../../../../types/core/chain/id';
import {
  MomentActivityChain,
  MomentAsset,
  MomentAtAsset,
} from '../../../../../types/core/chain/moment';
import { NFTAsset } from '../../../../../types/core/chain/nft';
import { NFTActivityChain } from '../../../../../types/core/chain/nft/NFTActivity';
import { NFTTemplateAsset } from '../../../../../types/core/chain/nft/NFTTemplate';
import {
  SocialRaffleChain,
  SocialRaffleRecord,
} from '../../../../../types/core/chain/socialRaffle';

export const invokeGetCollectionIdFromName = async (
  channel: BaseChannel,
  name: string,
): Promise<CollectionIdAsset | undefined> =>
  channel.invoke('redeemableNft:getCollectionIdFromName', { name });

export const invokeGetCollectionIdFromSymbol = async (
  channel: BaseChannel,
  symbol: string,
): Promise<CollectionIdAsset | undefined> =>
  channel.invoke('redeemableNft:getCollectionIdFromSymbol', { symbol });

export const invokeGetNFTIdFromSerial = async (
  channel: BaseChannel,
  serial: string,
): Promise<NFTIdAsset | undefined> =>
  channel.invoke('redeemableNft:getNFTIdFromSerial', { serial });

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

export const invokeGetCommentClubs = async (
  channel: BaseChannel,
  id: string,
): Promise<CommentClubsAsset> => channel.invoke('redeemableNft:getCommentClubs', { id });

export const invokeGetComment = async (
  channel: BaseChannel,
  id: string,
): Promise<CommentAsset | undefined> => channel.invoke('redeemableNft:getComment', { id });

export const invokeGetNFTComment = async (
  channel: BaseChannel,
  id: string,
): Promise<CommentAtAsset> => channel.invoke('redeemableNft:getNFTComment', { id });

export const invokeGetNFTCommentClubs = async (
  channel: BaseChannel,
  id: string,
): Promise<CommentClubsAtAsset> => channel.invoke('redeemableNft:getNFTCommentClubs', { id });

export const invokeGetCollectionComment = async (
  channel: BaseChannel,
  id: string,
): Promise<CommentAtAsset> => channel.invoke('redeemableNft:getCollectionComment', { id });

export const invokeGetCollectionCommentClubs = async (
  channel: BaseChannel,
  id: string,
): Promise<CommentClubsAtAsset> =>
  channel.invoke('redeemableNft:getCollectionCommentClubs', { id });

export const invokeGetMomentComment = async (
  channel: BaseChannel,
  id: string,
): Promise<CommentAtAsset> => channel.invoke('redeemableNft:getMomentComment', { id });

export const invokeGetReply = async (
  channel: BaseChannel,
  id: string,
): Promise<ReplyAsset | undefined> => channel.invoke('redeemableNft:getReply', { id });

export const invokeGetReplyClubs = async (
  channel: BaseChannel,
  id: string,
): Promise<ReplyAsset | undefined> => channel.invoke('redeemableNft:getReplyClubs', { id });

export const invokeGetCommentReply = async (
  channel: BaseChannel,
  id: string,
): Promise<ReplyAtAsset> => channel.invoke('redeemableNft:getCommentReply', { id });

export const invokeGetCommentClubsReply = async (
  channel: BaseChannel,
  id: string,
): Promise<ReplyAtAsset> => channel.invoke('redeemableNft:getCommentClubsReply', { id });

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

export const invokeGetActivityNFT = async (
  channel: BaseChannel,
  id: string,
): Promise<NFTActivityChain> => channel.invoke('redeemableNft:getActivityNFT', { id });

export const invokeGetActivityMoment = async (
  channel: BaseChannel,
  id: string,
): Promise<MomentActivityChain> => channel.invoke('redeemableNft:getActivityMoment', { id });

export const invokeGetMoment = async (
  channel: BaseChannel,
  id: string,
): Promise<MomentAsset | undefined> => channel.invoke('redeemableNft:getMoment', { id });

export const invokeGetMomentAt = async (channel: BaseChannel, id: string): Promise<MomentAtAsset> =>
  channel.invoke('redeemableNft:getMomentAt', { id });

export const invokeGetActivityCollection = async (
  channel: BaseChannel,
  id: string,
): Promise<CollectionActivityChain> =>
  channel.invoke('redeemableNft:getActivityCollection', { id });

export const invokeGetActivityProfile = async (
  channel: BaseChannel,
  address: string,
): Promise<ProfileActivityChain> => channel.invoke('redeemableNft:getActivityProfile', { address });

export const invokeGetActivityEngagement = async (
  channel: BaseChannel,
  address: string,
): Promise<EngagementActivityChain> =>
  channel.invoke('redeemableNft:getActivityEngagement', { address });

export const invokeGetAccountStats = async (
  channel: BaseChannel,
  address: string,
): Promise<RedeemableNFTAccountStatsChain> =>
  channel.invoke('redeemableNft:getAccountStats', { address });

export const invokeIsNameExists = async (channel: BaseChannel, name: string): Promise<boolean> =>
  channel.invoke('redeemableNft:isNameExists', { name });

export const invokeIsSymbolExists = async (
  channel: BaseChannel,
  symbol: string,
): Promise<boolean> => channel.invoke('redeemableNft:isSymbolExists', { symbol });

export const invokeIsSerialExists = async (
  channel: BaseChannel,
  serial: string,
): Promise<boolean> => channel.invoke('redeemableNft:isSerialExists', { serial });

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
