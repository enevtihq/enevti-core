import { BaseChannel } from 'lisk-framework';
import {
  CollectionActivityChain,
  CollectionAsset,
} from '../../../../../types/core/chain/collection';
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
  offset: number,
  limit: number,
): Promise<CollectionAsset[]> =>
  channel.invoke('redeemableNft:getAllCollection', { offset, limit });

export const invokeGetCollection = async (
  channel: BaseChannel,
  id: string,
): Promise<CollectionAsset | undefined> => channel.invoke('redeemableNft:getCollection', { id });

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
): Promise<NFTActivityChain | undefined> => channel.invoke('redeemableNft:getActivityNFT', { id });

export const invokeGetActivityCollection = async (
  channel: BaseChannel,
  id: string,
): Promise<CollectionActivityChain | undefined> =>
  channel.invoke('redeemableNft:getActivityCollection', { id });
