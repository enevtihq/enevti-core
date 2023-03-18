import { MomentSlotChain } from 'enevti-types/chain/moment';
import { BaseModuleDataAccess, codec, StateStore } from 'lisk-sdk';
import { CHAIN_STATE_MOMENT_SLOT } from '../constants/codec';
import { momentSlotSchema } from '../schemas/chain/momentSlot';

export const accessMomentSlot = async (
  dataAccess: BaseModuleDataAccess,
  address: Buffer,
): Promise<MomentSlotChain | undefined> => {
  const momentSlotBuffer = await dataAccess.getChainState(
    `${CHAIN_STATE_MOMENT_SLOT}:${address.toString('hex')}`,
  );
  if (!momentSlotBuffer) {
    return undefined;
  }
  return codec.decode<MomentSlotChain>(momentSlotSchema, momentSlotBuffer);
};

export const getMomentSlot = async (
  stateStore: StateStore,
  address: Buffer,
): Promise<MomentSlotChain | undefined> => {
  const momentSlotBuffer = await stateStore.chain.get(
    `${CHAIN_STATE_MOMENT_SLOT}:${address.toString('hex')}`,
  );
  if (!momentSlotBuffer) {
    return undefined;
  }
  return codec.decode<MomentSlotChain>(momentSlotSchema, momentSlotBuffer);
};

export const setMomentSlot = async (
  stateStore: StateStore,
  address: Buffer,
  momentSlot: MomentSlotChain,
) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_MOMENT_SLOT}:${address.toString('hex')}`,
    codec.encode(momentSlotSchema, momentSlot),
  );
};
