import { SocialRaffleCollectionChain } from 'enevti-types/chain/social_raffle';
import { codec, StateStore, BaseModuleDataAccess } from 'lisk-sdk';
import { COLLECTION_RAFFLE_CONFIG_PREFIX, SOCIAL_RAFFLE_PREFIX } from '../constants/codec';
import { collectionConfigSchema } from '../schema/collectionConfig';

export const accessCollectionRaffleConfig = async (
  dataAccess: BaseModuleDataAccess,
  collectionId: Buffer,
): Promise<SocialRaffleCollectionChain | undefined> => {
  const collectionConfigBuffer = await dataAccess.getChainState(
    `${SOCIAL_RAFFLE_PREFIX}:${collectionId.toString('hex')}:${COLLECTION_RAFFLE_CONFIG_PREFIX}`,
  );
  if (!collectionConfigBuffer) {
    return undefined;
  }
  return codec.decode<SocialRaffleCollectionChain>(collectionConfigSchema, collectionConfigBuffer);
};

export const getCollectionRaffleConfig = async (
  stateStore: StateStore,
  collectionId: Buffer,
): Promise<SocialRaffleCollectionChain | undefined> => {
  const collectionConfigBuffer = await stateStore.chain.get(
    `${SOCIAL_RAFFLE_PREFIX}:${collectionId.toString('hex')}:${COLLECTION_RAFFLE_CONFIG_PREFIX}`,
  );
  if (!collectionConfigBuffer) {
    return undefined;
  }
  return codec.decode<SocialRaffleCollectionChain>(collectionConfigSchema, collectionConfigBuffer);
};

export const setCollectionRaffleConfig = async (
  stateStore: StateStore,
  collectionId: Buffer,
  config: SocialRaffleCollectionChain,
) => {
  await stateStore.chain.set(
    `${SOCIAL_RAFFLE_PREFIX}:${collectionId.toString('hex')}:${COLLECTION_RAFFLE_CONFIG_PREFIX}`,
    codec.encode(collectionConfigSchema, config),
  );
};
