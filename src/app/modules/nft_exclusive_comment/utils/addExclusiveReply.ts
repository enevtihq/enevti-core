import { ReducerHandler, StateStore } from 'lisk-sdk';
import { AddExclusiveReplyPayload } from 'enevti-types/param/nft_exclusive_comment';
import { NFTAsset } from 'enevti-types/chain/nft';
import { CollectionAsset } from 'enevti-types/chain/collection';
import { getBlockTimestamp } from './timestamp';
import { getExclusiveReply, setExclusiveReply } from './replyItem';
import { getExclusiveReplies, setExclusiveReplies } from './replyList';
import { EXCLUSIVE_COMMENT_PREFIX, EXCLUSIVE_REPLY_PREFIX } from '../constants/codec';
import { getExclusiveComment } from './commentItem';

export const addExclusiveReply = async (
  stateStore: StateStore,
  reducerHandler: ReducerHandler,
  addExclusiveReplyPayload: AddExclusiveReplyPayload,
) => {
  let eligible = false;
  const { id, ...replyPayload } = addExclusiveReplyPayload;

  const existingReply = await getExclusiveReply(stateStore, id);
  if (existingReply) {
    throw new Error('Reply with provided id already exist');
  }

  const comment = await getExclusiveComment(stateStore, replyPayload.target);
  if (!comment) {
    throw new Error('Reply target is not a comment');
  }

  const nft = await reducerHandler.invoke<NFTAsset | undefined>('redeemable_nft:getNFT', {
    id: comment.target.toString('hex'),
  });
  const collection = nft
    ? await reducerHandler.invoke<CollectionAsset | undefined>('redeemable_nft:getCollection', {
        id: nft.collectionId.toString('hex'),
      })
    : undefined;
  const collectionOwners = collection ? collection.stat.owner : undefined;

  // TODO: change to inspect nft owner according to LIP-52
  // here the exclusive comment creator is compared to nft owner, if match then eligible
  if (nft && Buffer.compare(nft.owner, replyPayload.creator) === 0) {
    eligible = true;
  }

  // TODO: change to inspect collection owner/creator with LIP-52 standard
  // here the exclusive comment creator is compared to collection creator, if match then eligible
  if (!eligible && collection && Buffer.compare(collection.creator, replyPayload.creator) === 0) {
    eligible = true;
  }

  // TODO: change to inspect 'collection' attribute from NFT, if exist see if creator exists in owners attribute in 'collection'
  // here the exclusive comment creator is compared to the list of collection owners, if match then eligible
  if (
    !eligible &&
    collectionOwners &&
    collectionOwners.findIndex(o => Buffer.compare(o, replyPayload.creator) === 0) > -1
  ) {
    eligible = true;
  }

  if (!eligible) {
    throw new Error('Not authorized to give exclusive comment on this target');
  }

  const reply = {
    ...replyPayload,
    date: BigInt(getBlockTimestamp(stateStore)),
  };
  await setExclusiveReply(stateStore, id, reply);

  const replyItem = (await getExclusiveReplies(stateStore, reply.target)) ?? { items: [] };
  replyItem.items.unshift(id);
  await setExclusiveReplies(stateStore, reply.target, replyItem);

  await reducerHandler.invoke('count:addCount', {
    module: EXCLUSIVE_COMMENT_PREFIX,
    key: EXCLUSIVE_REPLY_PREFIX,
    address: addExclusiveReplyPayload.creator,
    item: id,
  });
};
