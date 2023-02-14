import { BaseModuleDataAccess, StateStore } from 'lisk-framework';
import { codec } from 'lisk-sdk';
import { MomentActivityChain, MomentActivityChainItems } from 'enevti-types/chain/moment';
import { CHAIN_STATE_ACTIVITY_MOMENT } from '../../constants/codec';
import { activityMomentSchema } from '../../schemas/chain/activity';

export const accessActivityMoment = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
): Promise<MomentActivityChain> => {
  const activityBuffer = await dataAccess.getChainState(`${CHAIN_STATE_ACTIVITY_MOMENT}:${id}`);
  if (!activityBuffer) {
    return { items: [] };
  }
  return codec.decode<MomentActivityChain>(activityMomentSchema, activityBuffer);
};

export const getActivityMoment = async (
  stateStore: StateStore,
  id: string,
): Promise<MomentActivityChain> => {
  const activityBuffer = await stateStore.chain.get(`${CHAIN_STATE_ACTIVITY_MOMENT}:${id}`);
  if (!activityBuffer) {
    return { items: [] };
  }
  return codec.decode<MomentActivityChain>(activityMomentSchema, activityBuffer);
};

export const setActivityMoment = async (
  stateStore: StateStore,
  id: string,
  activityChain: MomentActivityChain,
) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_ACTIVITY_MOMENT}:${id}`,
    codec.encode(activityMomentSchema, activityChain),
  );
};

export const addActivityMoment = async (
  stateStore: StateStore,
  id: string,
  activityItem: MomentActivityChainItems,
) => {
  const activityChain = await getActivityMoment(stateStore, id);
  activityChain.items.unshift(activityItem);
  await setActivityMoment(stateStore, id, activityChain);
};
