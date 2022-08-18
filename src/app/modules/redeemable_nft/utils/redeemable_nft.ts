import { codec, StateStore, BaseModuleDataAccess } from 'lisk-sdk';
import { allRedeemableNFTSchema, redeemableNFTSchema } from '../schemas/chain/redeemable_nft';
import { CHAIN_STATE_ALL_NFT, CHAIN_STATE_NFT } from '../constants/codec';
import { AllNFT, NFTAsset } from '../../../../types/core/chain/nft';
import { createPagination } from './transaction';

export const accessAllNFT = async (
  dataAccess: BaseModuleDataAccess,
  offset = 0,
  limit?: number,
): Promise<AllNFT> => {
  const allNFTBuffer = await dataAccess.getChainState(CHAIN_STATE_ALL_NFT);
  if (!allNFTBuffer) {
    return { items: [] };
  }
  const allNFT = codec.decode<AllNFT>(allRedeemableNFTSchema, allNFTBuffer);
  const { l } = createPagination(allNFT.items.length, undefined, offset, limit);
  allNFT.items.slice(offset, offset + l);
  return allNFT;
};

export const getAllNFT = async (
  stateStore: StateStore,
  offset = 0,
  limit?: number,
): Promise<AllNFT> => {
  const allNFTBuffer = await stateStore.chain.get(CHAIN_STATE_ALL_NFT);
  if (!allNFTBuffer) {
    return { items: [] };
  }
  const allNFT = codec.decode<AllNFT>(allRedeemableNFTSchema, allNFTBuffer);
  const { l } = createPagination(allNFT.items.length, undefined, offset, limit);
  allNFT.items.slice(offset, offset + l);
  return allNFT;
};

export const setAllNFT = async (stateStore: StateStore, allNFT: AllNFT) => {
  await stateStore.chain.set(CHAIN_STATE_ALL_NFT, codec.encode(allRedeemableNFTSchema, allNFT));
};

export const accessNFTById = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
): Promise<NFTAsset | undefined> => {
  const NFTBuffer = await dataAccess.getChainState(`${CHAIN_STATE_NFT}:${id}`);
  if (!NFTBuffer) {
    return undefined;
  }
  return codec.decode<NFTAsset>(redeemableNFTSchema, NFTBuffer);
};

export const getNFTById = async (
  stateStore: StateStore,
  id: string,
): Promise<NFTAsset | undefined> => {
  const NFTBuffer = await stateStore.chain.get(`${CHAIN_STATE_NFT}:${id}`);
  if (!NFTBuffer) {
    return undefined;
  }
  return codec.decode<NFTAsset>(redeemableNFTSchema, NFTBuffer);
};

export const setNFTById = async (stateStore: StateStore, id: string, nft: NFTAsset) => {
  await stateStore.chain.set(`${CHAIN_STATE_NFT}:${id}`, codec.encode(redeemableNFTSchema, nft));
};
