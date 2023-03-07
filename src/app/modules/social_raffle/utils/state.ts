import { SocialRaffleChain } from 'enevti-types/chain/social_raffle';
import { codec, StateStore, BaseModuleDataAccess } from 'lisk-sdk';
import { SOCIAL_RAFFLE_PREFIX, RAFFLE_STATE_PREFIX } from '../constants/codec';
import { raffleStateSchema } from '../schema/state';

export const accessSocialRaffleState = async (
  dataAccess: BaseModuleDataAccess,
): Promise<SocialRaffleChain> => {
  const stateBuffer = await dataAccess.getChainState(
    `${SOCIAL_RAFFLE_PREFIX}:${RAFFLE_STATE_PREFIX}`,
  );
  if (!stateBuffer) {
    return { pool: BigInt(0), registrar: [] };
  }
  return codec.decode<SocialRaffleChain>(raffleStateSchema, stateBuffer);
};

export const getSocialRaffleState = async (stateStore: StateStore): Promise<SocialRaffleChain> => {
  const stateBuffer = await stateStore.chain.get(`${SOCIAL_RAFFLE_PREFIX}:${RAFFLE_STATE_PREFIX}`);
  if (!stateBuffer) {
    return { pool: BigInt(0), registrar: [] };
  }
  return codec.decode<SocialRaffleChain>(raffleStateSchema, stateBuffer);
};

export const setSocialRaffleState = async (stateStore: StateStore, state: SocialRaffleChain) => {
  await stateStore.chain.set(
    `${SOCIAL_RAFFLE_PREFIX}:${RAFFLE_STATE_PREFIX}`,
    codec.encode(raffleStateSchema, state),
  );
};

export const resetSocialRaffleStateRegistrar = async (stateStore: StateStore) => {
  const socialRaffleState = await getSocialRaffleState(stateStore);
  await setSocialRaffleState(stateStore, { pool: socialRaffleState.pool, registrar: [] });
};
