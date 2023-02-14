import { codec, StateStore, BaseModuleDataAccess } from 'lisk-sdk';
import { AllMoment, MomentAsset, MomentAtAsset } from 'enevti-types/chain/moment';
import { CHAIN_STATE_ALL_MOMENT, CHAIN_STATE_MOMENT } from '../constants/codec';
import { allMomentSchema, momentAtSchema, momentSchema } from '../schemas/chain/moment';
import { createPagination } from './transaction';

export const accessAllMoment = async (
  dataAccess: BaseModuleDataAccess,
  offset = 0,
  limit?: number,
  version?: number,
): Promise<{ allMoment: AllMoment; version: number }> => {
  const momentBuffer = await dataAccess.getChainState(CHAIN_STATE_ALL_MOMENT);
  if (!momentBuffer) {
    return {
      allMoment: {
        items: [],
      },
      version: 0,
    };
  }

  const allMoment = codec.decode<AllMoment>(allMomentSchema, momentBuffer);
  const { v, o, c } = createPagination(allMoment.items.length, version, offset, limit);
  allMoment.items.slice(o, c);
  return { allMoment, version: v };
};

export const getAllMoment = async (
  stateStore: StateStore,
  offset = 0,
  limit?: number,
  version?: number,
): Promise<AllMoment> => {
  const momentBuffer = await stateStore.chain.get(CHAIN_STATE_ALL_MOMENT);
  if (!momentBuffer) {
    return {
      items: [],
    };
  }

  const allMoment = codec.decode<AllMoment>(allMomentSchema, momentBuffer);
  const { o, c } = createPagination(allMoment.items.length, version, offset, limit);
  allMoment.items.slice(o, c);
  return allMoment;
};

export const setAllMoment = async (stateStore: StateStore, allMoment: AllMoment) => {
  await stateStore.chain.set(CHAIN_STATE_ALL_MOMENT, codec.encode(allMomentSchema, allMoment));
};

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
