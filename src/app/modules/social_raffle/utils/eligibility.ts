import { CollectionAsset } from 'enevti-types/chain/collection';
import { CountChain } from 'enevti-types/chain/count';
import { SocialRaffleCollectionChain } from 'enevti-types/chain/social_raffle';
import { SocialRaffleConfig } from 'enevti-types/chain/social_raffle/config';
import { GetCountParam } from 'enevti-types/param/count';
import { GetCollectionRaffleConfig } from 'enevti-types/param/social_raffle';
import { ReducerHandler } from 'lisk-framework';
import { SOCIAL_RAFFLE_PREFIX } from '../constants/codec';

export const isCollectionEligibleForRaffle = async (
  reducerHandler: ReducerHandler,
  collectionId: Buffer,
) => {
  const config = await reducerHandler.invoke<SocialRaffleConfig>(
    `${SOCIAL_RAFFLE_PREFIX}:getConfig`,
  );

  // TODO: change to LIP-52 based collection retrival
  const collection = await reducerHandler.invoke<CollectionAsset | undefined>(
    'redeemableNft:getCollection',
    { id: collectionId.toString('hex') },
  );
  if (!collection) throw new Error('Collection not found while monintorng social raffle');

  const countChain = (await reducerHandler.invoke<CountChain | undefined>('count:getCount', {
    module: SOCIAL_RAFFLE_PREFIX,
    address: collectionId,
  } as GetCountParam)) ?? { total: 0 };

  const collectionConfig = await reducerHandler.invoke<SocialRaffleCollectionChain | undefined>(
    `${SOCIAL_RAFFLE_PREFIX}:getCollectionRaffleConfig`,
    { id: collectionId } as GetCollectionRaffleConfig,
  );

  let priceEligible = true;
  let raffleLimitEligible = true;
  let quantityEligible = true;

  if (BigInt(config.socialRaffle.maxPrice) > BigInt(-1)) {
    priceEligible = collection.minting.price.amount < BigInt(config.socialRaffle.maxPrice);
  }

  if (config.socialRaffle.maxRaffledPerCollection > -1) {
    if (collectionConfig?.activated) {
      raffleLimitEligible = countChain.total < config.socialRaffle.maxRaffledPerCollection;
    } else {
      raffleLimitEligible = false;
    }
  }

  if (collection.minting.available.length < collection.packSize) {
    quantityEligible = false;
  }

  return priceEligible && raffleLimitEligible && quantityEligible;
};

export const isProfileEligibleForRaffle = async (
  reducerHandler: ReducerHandler,
  address: Buffer,
) => {
  const config = await reducerHandler.invoke<SocialRaffleConfig>(
    `${SOCIAL_RAFFLE_PREFIX}:getConfig`,
  );

  const countChain = (await reducerHandler.invoke<CountChain | undefined>('count:getCount', {
    module: SOCIAL_RAFFLE_PREFIX,
    address,
  } as GetCountParam)) ?? { total: 0 };

  if (config.socialRaffle.maxRaffledPerProfile > -1) {
    if (countChain.total < config.socialRaffle.maxRaffledPerProfile) {
      return true;
    }
    return false;
  }
  return true;
};
