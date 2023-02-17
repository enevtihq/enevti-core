import { ActivityGenesisChain } from 'enevti-types/chain/activity';
import { codec, StateStore } from 'lisk-sdk';
import { ACTIVITY_PREFIX, GENESIS_ACTIVITY_PREFIX } from '../constants/codec';
import { activityGenesisSchema } from '../schema/genesis';

export const getActivityGenesis = async (
  stateStore: StateStore,
  identifier: string,
  key: string,
): Promise<ActivityGenesisChain | undefined> => {
  const activityGenesisBuffer = await stateStore.chain.get(
    `${ACTIVITY_PREFIX}:${identifier}:${key}:${GENESIS_ACTIVITY_PREFIX}`,
  );
  if (!activityGenesisBuffer) {
    return undefined;
  }
  return codec.decode<ActivityGenesisChain>(activityGenesisSchema, activityGenesisBuffer);
};

export const setActivityGenesis = async (
  stateStore: StateStore,
  identifier: string,
  key: string,
  activityGenesis: ActivityGenesisChain,
) => {
  await stateStore.chain.set(
    `${ACTIVITY_PREFIX}:${identifier}:${key}:${GENESIS_ACTIVITY_PREFIX}`,
    codec.encode(activityGenesisSchema, activityGenesis),
  );
};
