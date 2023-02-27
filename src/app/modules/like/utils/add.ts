import { ReducerHandler, StateStore } from 'lisk-sdk';
import { LIKE_MODULE_PREFIX } from '../constants/codec';
import { getLike, setLike } from './like';
import { getLiked, setLiked } from './liked';

export const addLike = async (
  stateStore: StateStore,
  reducerHandler: ReducerHandler,
  identifier: string,
  target: string,
  senderAddress: Buffer,
) => {
  const liked = await getLiked(stateStore, target, senderAddress);
  if (liked && liked.status === 1) {
    throw new Error('Sender already like this target');
  }
  await setLiked(stateStore, target, senderAddress, { status: 1 });

  const like = (await getLike(stateStore, identifier, target)) ?? { address: [] };
  like.address.unshift(senderAddress);
  await setLike(stateStore, identifier, target, like);

  await reducerHandler.invoke('count:addCount', {
    module: LIKE_MODULE_PREFIX,
    key: identifier,
    address: senderAddress,
    item: Buffer.from(target, 'hex'),
  });
};
