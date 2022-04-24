import { codec, StateStore } from 'lisk-sdk';
import { allRedeemableNFTSchema, redeemableNFTSchema } from '../schemas/chain/redeemable_nft';
import { CHAIN_STATE_ALL_NFT, CHAIN_STATE_NFT } from '../constants/codec';
import { AllNFT, NFTAsset } from '../../../../types/core/chain/nft';

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
  const l = limit ?? allNFT.items.length - offset;
  allNFT.items.slice(offset, l);
  return allNFT;
};

export const setAllNFT = async (stateStore: StateStore, allNFT: AllNFT) => {
  await stateStore.chain.set(CHAIN_STATE_ALL_NFT, codec.encode(allRedeemableNFTSchema, allNFT));
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
