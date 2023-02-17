import { ActivityListChain } from 'enevti-types/chain/activity';
import { codec, StateStore, BaseModuleDataAccess } from 'lisk-sdk';
import { ACTIVITY_PREFIX } from '../constants/codec';
import { activityListSchema } from '../schema/list';

export const accessActivities = async (
  dataAccess: BaseModuleDataAccess,
  identifier: string,
  key: string,
): Promise<ActivityListChain | undefined> => {
  const activitiesBuffer = await dataAccess.getChainState(
    `${ACTIVITY_PREFIX}:${identifier}:${key}`,
  );
  if (!activitiesBuffer) {
    return undefined;
  }
  return codec.decode<ActivityListChain>(activityListSchema, activitiesBuffer);
};

export const getActivities = async (
  stateStore: StateStore,
  identifier: string,
  key: string,
): Promise<ActivityListChain | undefined> => {
  const activitiesBuffer = await stateStore.chain.get(`${ACTIVITY_PREFIX}:${identifier}:${key}`);
  if (!activitiesBuffer) {
    return undefined;
  }
  return codec.decode<ActivityListChain>(activityListSchema, activitiesBuffer);
};

export const setActivities = async (
  stateStore: StateStore,
  identifier: string,
  key: string,
  activities: ActivityListChain,
) => {
  await stateStore.chain.set(
    `${ACTIVITY_PREFIX}:${identifier}:${key}`,
    codec.encode(activityListSchema, activities),
  );
};
