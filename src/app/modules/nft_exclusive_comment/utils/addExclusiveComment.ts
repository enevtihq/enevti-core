import { ReducerHandler, StateStore } from 'lisk-sdk';
import { AddExclusiveCommentPayload } from 'enevti-types/param/nft_exclusive_comment';
import { NFTAsset } from 'enevti-types/chain/nft';
import { CollectionAsset } from 'enevti-types/chain/collection';
import { getExclusiveComment, setExclusiveComment } from './commentItem';
import { getExclusiveComments, setExclusiveComments } from './commentList';
import { EXCLUSIVE_COMMENT_PREFIX } from '../constants/codec';
import { getBlockTimestamp } from './timestamp';

export const addExclusiveComment = async (
  stateStore: StateStore,
  reducerHandler: ReducerHandler,
  addExclusiveCommentPayload: AddExclusiveCommentPayload,
) => {
  let eligible = false;
  const { id, identifier, ...exclusiveCommentPayload } = addExclusiveCommentPayload;

  const existingExclusiveComment = await getExclusiveComment(stateStore, id);
  if (existingExclusiveComment) {
    throw new Error('Exclusive Comment with provided id already exist');
  }

  const nft = await reducerHandler.invoke<NFTAsset | undefined>('redeemable_nft:getNFT', {
    id: exclusiveCommentPayload.target.toString('hex'),
  });
  const collection = nft
    ? await reducerHandler.invoke<CollectionAsset | undefined>('redeemable_nft:getCollection', {
        id: nft.collectionId.toString('hex'),
      })
    : undefined;
  const collectionOwners = collection ? collection.stat.owner : undefined;

  // TODO: change to inspect nft owner according to LIP-52
  // here the exclusive comment creator is compared to nft owner, if match then eligible
  if (nft && Buffer.compare(nft.owner, exclusiveCommentPayload.creator) === 0) {
    eligible = true;
  }

  // TODO: change to inspect collection owner/creator with LIP-52 standard
  // here the exclusive comment creator is compared to collection creator, if match then eligible
  if (
    !eligible &&
    collection &&
    Buffer.compare(collection.creator, exclusiveCommentPayload.creator) === 0
  ) {
    eligible = true;
  }

  // TODO: change to inspect 'collection' attribute from NFT, if exist see if creator exists in owners attribute in 'collection'
  // here the exclusive comment creator is compared to the list of collection owners, if match then eligible
  if (
    !eligible &&
    collectionOwners &&
    collectionOwners.findIndex(o => Buffer.compare(o, exclusiveCommentPayload.creator) === 0) > -1
  ) {
    eligible = true;
  }

  if (!eligible) {
    throw new Error('Not authorized to give exclusive comment on this target');
  }

  const exclusiveComment = {
    ...exclusiveCommentPayload,
    date: BigInt(getBlockTimestamp(stateStore)),
  };
  await setExclusiveComment(stateStore, id, exclusiveComment);

  const exclusiveCommentItem = (await getExclusiveComments(
    stateStore,
    identifier,
    exclusiveComment.target.toString('hex'),
  )) ?? { items: [] };
  exclusiveCommentItem.items.unshift(id);
  await setExclusiveComments(
    stateStore,
    identifier,
    exclusiveComment.target.toString('hex'),
    exclusiveCommentItem,
  );

  await reducerHandler.invoke('count:addCount', {
    module: EXCLUSIVE_COMMENT_PREFIX,
    key: identifier,
    address: addExclusiveCommentPayload.creator,
    item: id,
  });
};
