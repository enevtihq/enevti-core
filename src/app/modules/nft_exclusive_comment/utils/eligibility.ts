import { CollectionAsset } from 'enevti-types/chain/collection';
import { MomentAsset } from 'enevti-types/chain/moment';
import { NFTAsset } from 'enevti-types/chain/nft';
import { ReducerHandler } from 'lisk-framework';

export const isTargetEligible = async (
  reducerHandler: ReducerHandler,
  target: Buffer,
  address: Buffer,
): Promise<boolean> => {
  let eligible = false;
  const nft = await reducerHandler.invoke<NFTAsset | undefined>('redeemableNft:getNFT', {
    id: target.toString('hex'),
  });
  const collection = nft
    ? await reducerHandler.invoke<CollectionAsset | undefined>('redeemableNft:getCollection', {
        id: nft.collectionId.toString('hex'),
      })
    : undefined;
  const collectionOwners = collection ? collection.stat.owner : undefined;

  // TODO: change to inspect nft owner according to LIP-52
  // here the exclusive comment creator is compared to nft owner, if match then eligible
  if (nft && Buffer.compare(nft.owner, address) === 0) {
    eligible = true;
  }

  if (!eligible && !nft) {
    // TODO: change to inspect moment creator with LIP-52 standard, moment will be an NFT in the future
    // here the exclusive comment creator is compared to moment creator, if match then eligible
    const moment = await reducerHandler.invoke<MomentAsset | undefined>('redeemableNft:getMoment', {
      id: target.toString('hex'),
    });
    if (moment && Buffer.compare(moment.creator, address) === 0) {
      eligible = true;
    }
  }

  // TODO: change to inspect collection owner/creator with LIP-52 standard
  // here the exclusive comment creator is compared to collection creator, if match then eligible
  if (!eligible && collection && Buffer.compare(collection.creator, address) === 0) {
    eligible = true;
  }

  // TODO: change to inspect 'collection' attribute from NFT, if exist see if creator exists in owners attribute in 'collection'
  // here the exclusive comment creator is compared to the list of collection owners, if match then eligible
  if (
    !eligible &&
    collectionOwners &&
    collectionOwners.findIndex(o => Buffer.compare(o, address) === 0) > -1
  ) {
    eligible = true;
  }

  return eligible;
};
