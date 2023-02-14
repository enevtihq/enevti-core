import { BaseModuleDataAccess, StateStore } from 'lisk-framework';
import { codec } from 'lisk-sdk';
import { ProfileActivityChain, ProfileActivityChainItems } from 'enevti-types/account/profile';
import { CHAIN_STATE_ACTIVITY_PROFILE } from '../../constants/codec';
import { activityProfileSchema } from '../../schemas/chain/activity';

export const accessActivityProfile = async (
  dataAccess: BaseModuleDataAccess,
  address: string,
): Promise<ProfileActivityChain> => {
  const activityBuffer = await dataAccess.getChainState(
    `${CHAIN_STATE_ACTIVITY_PROFILE}:${address}`,
  );
  if (!activityBuffer) {
    return { items: [] };
  }
  return codec.decode<ProfileActivityChain>(activityProfileSchema, activityBuffer);
};

export const getActivityProfile = async (
  stateStore: StateStore,
  address: string,
): Promise<ProfileActivityChain> => {
  const activityBuffer = await stateStore.chain.get(`${CHAIN_STATE_ACTIVITY_PROFILE}:${address}`);
  if (!activityBuffer) {
    return { items: [] };
  }
  return codec.decode<ProfileActivityChain>(activityProfileSchema, activityBuffer);
};

export const setActivityProfile = async (
  stateStore: StateStore,
  address: string,
  activity: ProfileActivityChain,
) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_ACTIVITY_PROFILE}:${address}`,
    codec.encode(activityProfileSchema, activity),
  );
};

export const addActivityProfile = async (
  stateStore: StateStore,
  address: string,
  activity: ProfileActivityChainItems,
) => {
  const activityChain = await getActivityProfile(stateStore, address);
  activityChain.items.unshift(activity);
  await setActivityProfile(stateStore, address, activityChain);
};
