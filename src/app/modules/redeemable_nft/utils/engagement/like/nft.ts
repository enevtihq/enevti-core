import { BaseModuleDataAccess, StateStore } from 'lisk-framework';
import { codec } from 'lisk-sdk';
import { LikeAtAsset } from '../../../../../../types/core/chain/engagement';
import { CHAIN_STATE_LIKE } from '../../../constants/codec';
import { likeAtSchema } from '../../../schemas/chain/engagement';
import { setLiked, getLiked } from './liked';

export const accessNFTLikeById = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
): Promise<LikeAtAsset> => {
  const likeNftBuffer = await dataAccess.getChainState(`${CHAIN_STATE_LIKE}:nft:${id}`);
  if (!likeNftBuffer) {
    return { address: [] };
  }
  return codec.decode<LikeAtAsset>(likeAtSchema, likeNftBuffer);
};

export const getNFTLikeById = async (stateStore: StateStore, id: string): Promise<LikeAtAsset> => {
  const likeNftBuffer = await stateStore.chain.get(`${CHAIN_STATE_LIKE}:nft:${id}`);
  if (!likeNftBuffer) {
    return { address: [] };
  }
  return codec.decode<LikeAtAsset>(likeAtSchema, likeNftBuffer);
};

export const setNFTLikeById = async (stateStore: StateStore, id: string, like: LikeAtAsset) => {
  await stateStore.chain.set(`${CHAIN_STATE_LIKE}:nft:${id}`, codec.encode(likeAtSchema, like));
};

export const addNFTLikeById = async (stateStore: StateStore, id: string, address: Buffer) => {
  const likeNft = await getNFTLikeById(stateStore, id);
  if (!likeNft) {
    await setNFTLikeById(stateStore, id, { address: [address] });
    await setLiked(stateStore, id, address.toString('hex'), 1);
    return;
  }

  const liked = await getLiked(stateStore, id, address.toString('hex'));
  if (liked === 0) {
    likeNft.address.unshift(address);
    await setNFTLikeById(stateStore, id, likeNft);
    await setLiked(stateStore, id, address.toString('hex'), 1);
  } else {
    throw Error('Address already exist');
  }
};
