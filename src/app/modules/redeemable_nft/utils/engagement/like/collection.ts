import { BaseModuleDataAccess, StateStore } from 'lisk-framework';
import { codec } from 'lisk-sdk';
import { LikeAtAsset } from 'enevti-types/chain/engagement';
import { CHAIN_STATE_LIKE } from '../../../constants/codec';
import { likeAtSchema } from '../../../schemas/chain/engagement';
import { setLiked, getLiked } from './liked';

export const accessCollectionLikeById = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
): Promise<LikeAtAsset> => {
  const likeCollectionBuffer = await dataAccess.getChainState(
    `${CHAIN_STATE_LIKE}:collection:${id}`,
  );
  if (!likeCollectionBuffer) {
    return { address: [] };
  }
  return codec.decode<LikeAtAsset>(likeAtSchema, likeCollectionBuffer);
};

export const getCollectionLikeById = async (
  stateStore: StateStore,
  id: string,
): Promise<LikeAtAsset> => {
  const likeCollectionBuffer = await stateStore.chain.get(`${CHAIN_STATE_LIKE}:collection:${id}`);
  if (!likeCollectionBuffer) {
    return { address: [] };
  }
  return codec.decode<LikeAtAsset>(likeAtSchema, likeCollectionBuffer);
};

export const setCollectionLikeById = async (
  stateStore: StateStore,
  id: string,
  like: LikeAtAsset,
) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_LIKE}:collection:${id}`,
    codec.encode(likeAtSchema, like),
  );
};

export const addCollectionLikeById = async (
  stateStore: StateStore,
  id: string,
  address: Buffer,
) => {
  const likeCollection = await getCollectionLikeById(stateStore, id);
  if (!likeCollection) {
    await setCollectionLikeById(stateStore, id, { address: [address] });
    await setLiked(stateStore, id, address.toString('hex'), 1);
    return;
  }

  const liked = await getLiked(stateStore, id, address.toString('hex'));
  if (liked === 0) {
    likeCollection.address.unshift(address);
    await setCollectionLikeById(stateStore, id, likeCollection);
    await setLiked(stateStore, id, address.toString('hex'), 1);
  } else {
    throw Error('Address already exist');
  }
};
