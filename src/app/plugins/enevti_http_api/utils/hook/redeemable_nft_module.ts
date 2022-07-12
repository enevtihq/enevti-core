import { BaseChannel } from 'lisk-framework';
import {
  EngagementActivityChain,
  ProfileActivityChain,
} from '../../../../../types/core/account/profile';
import {
  CollectionActivityChain,
  CollectionAsset,
} from '../../../../../types/core/chain/collection';
import { AllCommentAsset, AllLikeAsset } from '../../../../../types/core/chain/engagement';
import { CollectionIdAsset, NFTIdAsset, TemplateIdAsset } from '../../../../../types/core/chain/id';
import { NFTAsset } from '../../../../../types/core/chain/nft';
import { NFTActivityChain } from '../../../../../types/core/chain/nft/NFTActivity';
import { NFTTemplateAsset } from '../../../../../types/core/chain/nft/NFTTemplate';

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
  symbol: string,
): Promise<NFTIdAsset | undefined> =>
  channel.invoke('redeemableNft:getNFTIdFromSerial', { symbol });

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

export const invokeGetNFTLike = async (
  channel: BaseChannel,
  id: string,
): Promise<AllLikeAsset | undefined> => channel.invoke('redeemableNft:getNFTLike', { id });

export const invokeGetCollectionLike = async (
  channel: BaseChannel,
  id: string,
): Promise<AllLikeAsset | undefined> => channel.invoke('redeemableNft:getCollectionLike', { id });

export const invokeGetNFTComment = async (
  channel: BaseChannel,
  id: string,
): Promise<AllCommentAsset | undefined> => channel.invoke('redeemableNft:getNFTComment', { id });

export const invokeGetCollectionComment = async (
  channel: BaseChannel,
  id: string,
): Promise<AllCommentAsset | undefined> =>
  channel.invoke('redeemableNft:getCollectionComment', { id });

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
