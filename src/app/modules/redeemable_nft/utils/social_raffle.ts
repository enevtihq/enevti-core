import { codec, StateStore, BaseModuleDataAccess } from 'lisk-sdk';
import { RedeemableNFTAccountProps } from '../../../../types/core/account/profile';
import { CollectionAsset } from '../../../../types/core/chain/collection';
import { SocialRaffleGenesisConfig } from '../../../../types/core/chain/config/SocialRaffleGenesisConfig';
import {
  SocialRaffleChain,
  SocialRaffleRecord,
  SocialRaffleRegistrarItem,
} from '../../../../types/core/chain/socialRaffle';
import { CHAIN_STATE_SOCIAL_RAFFLE } from '../constants/codec';
import { socialRaffleRecordSchema, socialRaffleSchema } from '../schemas/chain/social_raffle';

export const accessSocialRaffleState = async (
  dataAccess: BaseModuleDataAccess,
): Promise<SocialRaffleChain> => {
  const socialRaffleBuffer = await dataAccess.getChainState(`${CHAIN_STATE_SOCIAL_RAFFLE}`);
  if (!socialRaffleBuffer) {
    return { pool: BigInt(0), registrar: [] };
  }
  return codec.decode<SocialRaffleChain>(socialRaffleSchema, socialRaffleBuffer);
};

export const getSocialRaffleState = async (stateStore: StateStore): Promise<SocialRaffleChain> => {
  const socialRaffleBuffer = await stateStore.chain.get(`${CHAIN_STATE_SOCIAL_RAFFLE}`);
  if (!socialRaffleBuffer) {
    return { pool: BigInt(0), registrar: [] };
  }
  return codec.decode<SocialRaffleChain>(socialRaffleSchema, socialRaffleBuffer);
};

export const setSocialRaffleState = async (
  stateStore: StateStore,
  socialRaffle: SocialRaffleChain,
) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_SOCIAL_RAFFLE}`,
    codec.encode(socialRaffleSchema, socialRaffle),
  );
};

export const accessSocialRaffleRecord = async (
  dataAccess: BaseModuleDataAccess,
  blockHeight: number,
): Promise<SocialRaffleRecord | undefined> => {
  const socialRaffleRecordBuffer = await dataAccess.getChainState(
    `${CHAIN_STATE_SOCIAL_RAFFLE}:${blockHeight}`,
  );
  if (!socialRaffleRecordBuffer) {
    return undefined;
  }
  return codec.decode<SocialRaffleRecord>(socialRaffleRecordSchema, socialRaffleRecordBuffer);
};

export const getSocialRaffleRecord = async (
  stateStore: StateStore,
  blockHeight: number,
): Promise<SocialRaffleRecord | undefined> => {
  const socialRaffleRecordBuffer = await stateStore.chain.get(
    `${CHAIN_STATE_SOCIAL_RAFFLE}:${blockHeight}`,
  );
  if (!socialRaffleRecordBuffer) {
    return undefined;
  }
  return codec.decode<SocialRaffleRecord>(socialRaffleRecordSchema, socialRaffleRecordBuffer);
};

export const setSocialRaffleRecord = async (
  stateStore: StateStore,
  blockHeight: number,
  socialRaffleRecord: SocialRaffleRecord,
) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_SOCIAL_RAFFLE}:${blockHeight}`,
    codec.encode(socialRaffleRecordSchema, socialRaffleRecord),
  );
};

export const addSocialRafflePool = async (stateStore: StateStore, point: bigint) => {
  const socialRaffleState = await getSocialRaffleState(stateStore);
  socialRaffleState.pool += point;
  await setSocialRaffleState(stateStore, socialRaffleState);
};

export const initSocialRaffleRegisrar = async (
  stateStore: StateStore,
  socialRaffleRegistrar: SocialRaffleRegistrarItem,
) => {
  const socialRaffleState = await getSocialRaffleState(stateStore);
  socialRaffleState.registrar.push(socialRaffleRegistrar);
  await setSocialRaffleState(stateStore, socialRaffleState);
};

export const addSocialRaffleCandidate = async (
  stateStore: StateStore,
  id: Buffer,
  candidatePublicKey: Buffer,
) => {
  const socialRaffleState = await getSocialRaffleState(stateStore);
  const index = socialRaffleState.registrar.findIndex(t => Buffer.compare(t.id, id) === 0);
  if (index === -1) {
    const registrarItem = { id, weight: BigInt(0), candidate: [candidatePublicKey] };
    await initSocialRaffleRegisrar(stateStore, registrarItem);
  } else {
    const candidateIndex = socialRaffleState.registrar[index].candidate.findIndex(
      t => Buffer.compare(t, candidatePublicKey) === 0,
    );
    if (candidateIndex === -1) {
      socialRaffleState.registrar[index].candidate.push(candidatePublicKey);
      await setSocialRaffleState(stateStore, socialRaffleState);
    }
  }
};

export const addSocialRaffleWeight = async (stateStore: StateStore, id: Buffer, weight: bigint) => {
  const socialRaffleState = await getSocialRaffleState(stateStore);
  const index = socialRaffleState.registrar.findIndex(t => Buffer.compare(t.id, id) === 0);
  if (index === -1) {
    const registrarItem = { id, weight, candidate: [] };
    await initSocialRaffleRegisrar(stateStore, registrarItem);
  } else {
    socialRaffleState.registrar[index].weight += weight;
    await setSocialRaffleState(stateStore, socialRaffleState);
  }
};

export const addSocialRaffleRegistrar = async (
  stateStore: StateStore,
  id: Buffer,
  candidatePublicKey: Buffer,
  weight: bigint,
) => {
  await addSocialRaffleCandidate(stateStore, id, candidatePublicKey);
  await addSocialRaffleWeight(stateStore, id, weight);
};

export const resetSocialRaffleStateRegistrar = async (stateStore: StateStore) => {
  const socialRaffleState = await getSocialRaffleState(stateStore);
  await setSocialRaffleState(stateStore, { pool: socialRaffleState.pool, registrar: [] });
};

export const resetSocialRaffleState = async (stateStore: StateStore) => {
  await setSocialRaffleState(stateStore, { pool: BigInt(0), registrar: [] });
};

export const isCollectionEligibleForRaffle = (
  collection: CollectionAsset,
  config: SocialRaffleGenesisConfig['socialRaffle'],
) =>
  (BigInt(config.maxPrice) > BigInt(-1)
    ? collection.minting.price.amount < BigInt(config.maxPrice)
    : true) &&
  // eslint-disable-next-line no-nested-ternary
  (config.maxRaffledPerCollection > -1
    ? collection.raffled > -1
      ? collection.raffled < config.maxRaffledPerCollection
      : false
    : true);

export const isProfileEligibleForRaffle = (
  profile: RedeemableNFTAccountProps,
  config: SocialRaffleGenesisConfig['socialRaffle'],
) =>
  config.maxRaffledPerProfile > -1
    ? profile.redeemableNft.raffled < config.maxRaffledPerProfile
    : true;
