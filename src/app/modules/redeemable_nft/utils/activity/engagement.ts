import { BaseModuleDataAccess, StateStore } from 'lisk-framework';
import { codec } from 'lisk-sdk';
import {
  EngagementActivityChain,
  EngagementActivityChainItems,
} from 'enevti-types/account/profile';
import { CHAIN_STATE_ACTIVITY_ENGAGEMENT } from '../../constants/codec';
import { activityEngagementSchema } from '../../schemas/chain/activity';

export const accessActivityEngagement = async (
  dataAccess: BaseModuleDataAccess,
  address: string,
): Promise<EngagementActivityChain> => {
  const activityBuffer = await dataAccess.getChainState(
    `${CHAIN_STATE_ACTIVITY_ENGAGEMENT}:${address}`,
  );
  if (!activityBuffer) {
    return { items: [] };
  }
  return codec.decode<EngagementActivityChain>(activityEngagementSchema, activityBuffer);
};

export const getActivityEngagement = async (
  stateStore: StateStore,
  address: string,
): Promise<EngagementActivityChain> => {
  const activityBuffer = await stateStore.chain.get(
    `${CHAIN_STATE_ACTIVITY_ENGAGEMENT}:${address}`,
  );
  if (!activityBuffer) {
    return { items: [] };
  }
  return codec.decode<EngagementActivityChain>(activityEngagementSchema, activityBuffer);
};

export const setActivityEngagement = async (
  stateStore: StateStore,
  address: string,
  activity: EngagementActivityChain,
) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_ACTIVITY_ENGAGEMENT}:${address}`,
    codec.encode(activityEngagementSchema, activity),
  );
};

export const addActivityEngagement = async (
  stateStore: StateStore,
  address: string,
  activity: EngagementActivityChainItems,
) => {
  const activityChain = await getActivityEngagement(stateStore, address);
  activityChain.items.unshift(activity);
  await setActivityEngagement(stateStore, address, activityChain);
};
