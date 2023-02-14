import { BaseModuleDataAccess, StateStore } from 'lisk-framework';
import { codec } from 'lisk-sdk';
import { LikeAtAsset } from 'enevti-types/chain/engagement';
import { CHAIN_STATE_LIKE } from '../../../constants/codec';
import { likeAtSchema } from '../../../schemas/chain/engagement';
import { setLiked, getLiked } from './liked';

export const accessCommentClubsLikeById = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
): Promise<LikeAtAsset> => {
  const likeCommentBuffer = await dataAccess.getChainState(
    `${CHAIN_STATE_LIKE}:commentClubs:${id}`,
  );
  if (!likeCommentBuffer) {
    return { address: [] };
  }
  return codec.decode<LikeAtAsset>(likeAtSchema, likeCommentBuffer);
};

export const getCommentClubsLikeById = async (
  stateStore: StateStore,
  id: string,
): Promise<LikeAtAsset> => {
  const likeCommentBuffer = await stateStore.chain.get(`${CHAIN_STATE_LIKE}:commentClubs:${id}`);
  if (!likeCommentBuffer) {
    return { address: [] };
  }
  return codec.decode<LikeAtAsset>(likeAtSchema, likeCommentBuffer);
};

export const setCommentClubsLikeById = async (
  stateStore: StateStore,
  id: string,
  like: LikeAtAsset,
) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_LIKE}:commentClubs:${id}`,
    codec.encode(likeAtSchema, like),
  );
};

export const addCommentClubsLikeById = async (
  stateStore: StateStore,
  id: string,
  address: Buffer,
) => {
  const likeComment = await getCommentClubsLikeById(stateStore, id);
  if (!likeComment) {
    await setCommentClubsLikeById(stateStore, id, { address: [address] });
    await setLiked(stateStore, id, address.toString('hex'), 1);
    return;
  }

  const liked = await getLiked(stateStore, id, address.toString('hex'));
  if (liked === 0) {
    likeComment.address.unshift(address);
    await setCommentClubsLikeById(stateStore, id, likeComment);
    await setLiked(stateStore, id, address.toString('hex'), 1);
  } else {
    throw Error('Address already exist');
  }
};
