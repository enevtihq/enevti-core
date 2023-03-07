import { SocialRaffleRegistrarItem } from 'enevti-types/chain/social_raffle';
import { StateStore } from 'lisk-sdk';
import { getSocialRaffleState, setSocialRaffleState } from './state';

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
) => {
  await addSocialRaffleCandidate(stateStore, id, candidatePublicKey);
  await addSocialRaffleWeight(stateStore, id, BigInt(1));
};
