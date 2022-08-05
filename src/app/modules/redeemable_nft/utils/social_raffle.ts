import { codec, StateStore, BaseModuleDataAccess } from 'lisk-sdk';
import { RedeemableNFTAccountProps } from '../../../../types/core/account/profile';
import { CollectionAsset } from '../../../../types/core/chain/collection';
import { SocialRaffleGenesisConfig } from '../../../../types/core/chain/config/SocialRaffleGenesisConfig';
import {
  SocialRaffleChain,
  SocialRaffleRegistrarItem,
} from '../../../../types/core/chain/socialRaffle';
import { CHAIN_STATE_SOCIAL_RAFFLE } from '../constants/codec';
import { socialRaffleSchema } from '../schemas/chain/social_raffle';

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

export const resetSocialRaffleState = async (stateStore: StateStore) => {
  await setSocialRaffleState(stateStore, { pool: BigInt(0), registrar: [] });
};

export const isCollectionEligibleForRaffle = (
  collection: CollectionAsset,
  config: SocialRaffleGenesisConfig['socialRaffle'],
) =>
  collection.minting.price.amount < config.maxPrice &&
  (config.maxRaffledPerCollection > -1
    ? collection.raffled < config.maxRaffledPerCollection
    : true);

export const isProfileEligibleForRaffle = (
  profile: RedeemableNFTAccountProps,
  config: SocialRaffleGenesisConfig['socialRaffle'],
) =>
  config.maxRaffledPerProfile > -1
    ? profile.redeemableNft.raffled < config.maxRaffledPerProfile
    : true;
