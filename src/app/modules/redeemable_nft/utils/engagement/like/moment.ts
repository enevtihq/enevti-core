import { BaseModuleDataAccess, StateStore } from 'lisk-framework';
import { codec } from 'lisk-sdk';
import { LikeAtAsset } from '../../../../../../types/core/chain/engagement';
import { CHAIN_STATE_LIKE } from '../../../constants/codec';
import { likeAtSchema } from '../../../schemas/chain/engagement';
import { setLiked, getLiked } from './liked';

export const accessMomentLikeById = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
): Promise<LikeAtAsset> => {
  const likeMomentBuffer = await dataAccess.getChainState(`${CHAIN_STATE_LIKE}:moment:${id}`);
  if (!likeMomentBuffer) {
    return { address: [] };
  }
  return codec.decode<LikeAtAsset>(likeAtSchema, likeMomentBuffer);
};

export const getMomentLikeById = async (
  stateStore: StateStore,
  id: string,
): Promise<LikeAtAsset> => {
  const likeMomentBuffer = await stateStore.chain.get(`${CHAIN_STATE_LIKE}:moment:${id}`);
  if (!likeMomentBuffer) {
    return { address: [] };
  }
  return codec.decode<LikeAtAsset>(likeAtSchema, likeMomentBuffer);
};

export const setMomentLikeById = async (stateStore: StateStore, id: string, like: LikeAtAsset) => {
  await stateStore.chain.set(`${CHAIN_STATE_LIKE}:moment:${id}`, codec.encode(likeAtSchema, like));
};

export const addMomentLikeById = async (stateStore: StateStore, id: string, address: Buffer) => {
  const likeMoment = await getMomentLikeById(stateStore, id);
  if (!likeMoment) {
    await setMomentLikeById(stateStore, id, { address: [address] });
    await setLiked(stateStore, id, address.toString('hex'), 1);
    return;
  }

  const liked = await getLiked(stateStore, id, address.toString('hex'));
  if (liked === 0) {
    likeMoment.address.unshift(address);
    await setMomentLikeById(stateStore, id, likeMoment);
    await setLiked(stateStore, id, address.toString('hex'), 1);
  } else {
    throw Error('Address already exist');
  }
};
