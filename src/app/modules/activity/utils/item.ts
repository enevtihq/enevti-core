import { ActivityItemChain } from 'enevti-types/chain/activity';
import { codec, StateStore, BaseModuleDataAccess } from 'lisk-sdk';
import { ACTIVITY_PREFIX } from '../constants/codec';
import { activityItemSchema } from '../schema/item';

export const accessActivity = async (
  dataAccess: BaseModuleDataAccess,
  id: Buffer,
): Promise<ActivityItemChain | undefined> => {
  const activityBuffer = await dataAccess.getChainState(`${ACTIVITY_PREFIX}:${id.toString('hex')}`);
  if (!activityBuffer) {
    return undefined;
  }
  return codec.decode<ActivityItemChain>(activityItemSchema, activityBuffer);
};

export const getActivity = async (
  stateStore: StateStore,
  id: Buffer,
): Promise<ActivityItemChain | undefined> => {
  const activityBuffer = await stateStore.chain.get(`${ACTIVITY_PREFIX}:${id.toString('hex')}`);
  if (!activityBuffer) {
    return undefined;
  }
  return codec.decode<ActivityItemChain>(activityItemSchema, activityBuffer);
};

export const setActivity = async (
  stateStore: StateStore,
  id: Buffer,
  activity: ActivityItemChain,
) => {
  await stateStore.chain.set(
    `${ACTIVITY_PREFIX}:${id.toString('hex')}`,
    codec.encode(activityItemSchema, activity),
  );
};
