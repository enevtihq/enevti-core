import { BaseModuleDataAccess, StateStore } from 'lisk-framework';
import { codec } from 'lisk-sdk';
import { LikeAtAsset } from 'enevti-types/chain/engagement';
import { CHAIN_STATE_LIKE } from '../../../constants/codec';
import { likeAtSchema } from '../../../schemas/chain/engagement';
import { setLiked, getLiked } from './liked';

export const accessReplyClubsLikeById = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
): Promise<LikeAtAsset> => {
  const likeReplyBuffer = await dataAccess.getChainState(`${CHAIN_STATE_LIKE}:replyClubs:${id}`);
  if (!likeReplyBuffer) {
    return { address: [] };
  }
  return codec.decode<LikeAtAsset>(likeAtSchema, likeReplyBuffer);
};

export const getReplyClubsLikeById = async (
  stateStore: StateStore,
  id: string,
): Promise<LikeAtAsset> => {
  const likeReplyBuffer = await stateStore.chain.get(`${CHAIN_STATE_LIKE}:replyClubs:${id}`);
  if (!likeReplyBuffer) {
    return { address: [] };
  }
  return codec.decode<LikeAtAsset>(likeAtSchema, likeReplyBuffer);
};

export const setReplyClubsLikeById = async (
  stateStore: StateStore,
  id: string,
  like: LikeAtAsset,
) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_LIKE}:replyClubs:${id}`,
    codec.encode(likeAtSchema, like),
  );
};

export const addReplyClubsLikeById = async (
  stateStore: StateStore,
  id: string,
  address: Buffer,
) => {
  const likeReply = await getReplyClubsLikeById(stateStore, id);
  if (!likeReply) {
    await setReplyClubsLikeById(stateStore, id, { address: [address] });
    await setLiked(stateStore, id, address.toString('hex'), 1);
    return;
  }

  const liked = await getLiked(stateStore, id, address.toString('hex'));
  if (liked === 0) {
    likeReply.address.unshift(address);
    await setReplyClubsLikeById(stateStore, id, likeReply);
    await setLiked(stateStore, id, address.toString('hex'), 1);
  } else {
    throw Error('Address already exist');
  }
};
