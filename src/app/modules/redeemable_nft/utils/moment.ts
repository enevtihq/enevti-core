import { codec, StateStore, BaseModuleDataAccess } from 'lisk-sdk';
import { MomentAsset, MomentAtAsset } from '../../../../types/core/chain/moment';
import { CHAIN_STATE_MOMENT } from '../constants/codec';
import { momentAtSchema, momentSchema } from '../schemas/chain/moment';

export const accessMomentById = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
): Promise<MomentAsset | undefined> => {
  const momentBuffer = await dataAccess.getChainState(`${CHAIN_STATE_MOMENT}:${id}`);
  if (!momentBuffer) {
    return undefined;
  }
  return codec.decode<MomentAsset>(momentSchema, momentBuffer);
};

export const getMomentById = async (
  stateStore: StateStore,
  id: string,
): Promise<MomentAsset | undefined> => {
  const momentBuffer = await stateStore.chain.get(`${CHAIN_STATE_MOMENT}:${id}`);
  if (!momentBuffer) {
    return undefined;
  }
  return codec.decode<MomentAsset>(momentSchema, momentBuffer);
};

export const setMomentById = async (stateStore: StateStore, id: string, moment: MomentAsset) => {
  await stateStore.chain.set(`${CHAIN_STATE_MOMENT}:${id}`, codec.encode(momentSchema, moment));
};

export const accessMomentAt = async (
  dataAccess: BaseModuleDataAccess,
  target: string,
): Promise<MomentAtAsset> => {
  const momentAtBuffer = await dataAccess.getChainState(`${CHAIN_STATE_MOMENT}:at:${target}`);
  if (!momentAtBuffer) {
    return { moment: [] };
  }
  return codec.decode<MomentAtAsset>(momentAtSchema, momentAtBuffer);
};

export const getMomentAt = async (
  stateStore: StateStore,
  target: string,
): Promise<MomentAtAsset> => {
  const momentAtBuffer = await stateStore.chain.get(`${CHAIN_STATE_MOMENT}:at:${target}`);
  if (!momentAtBuffer) {
    return { moment: [] };
  }
  return codec.decode<MomentAtAsset>(momentAtSchema, momentAtBuffer);
};

export const setMomentAt = async (
  stateStore: StateStore,
  target: string,
  momentAt: MomentAtAsset,
) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_MOMENT}:at:${target}`,
    codec.encode(momentAtSchema, momentAt),
  );
};
