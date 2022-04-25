import { codec, StateStore, BaseModuleDataAccess } from 'lisk-sdk';
import { StakerChain, StakerItemAsset } from '../../../../types/core/chain/stake';
import { CHAIN_STATE_STAKER } from '../constant/codec';
import { stakerSchema } from '../schema/chain/stake';

export const accessStakerByAddress = async (dataAccess: BaseModuleDataAccess, address: string) => {
  const stakerBuffer = await dataAccess.getChainState(`${CHAIN_STATE_STAKER}:${address}`);
  if (!stakerBuffer) {
    return undefined;
  }
  return codec.decode<StakerChain>(stakerSchema, stakerBuffer);
};

export const getStakerByAddress = async (stateStore: StateStore, address: string) => {
  const stakerBuffer = await stateStore.chain.get(`${CHAIN_STATE_STAKER}:${address}`);
  if (!stakerBuffer) {
    return undefined;
  }
  return codec.decode<StakerChain>(stakerSchema, stakerBuffer);
};

export const setStakerByAddress = async (
  stateStore: StateStore,
  address: string,
  staker: StakerChain,
) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_STAKER}:${address}`,
    codec.encode(stakerSchema, staker),
  );
};

export const addStakeByAddress = async (
  stateStore: StateStore,
  address: string,
  stakeItem: StakerItemAsset,
) => {
  const addressStaker = await getStakerByAddress(stateStore, address);
  if (!addressStaker) {
    throw new Error('staker data for address not found');
  }
  addressStaker.total += stakeItem.stake;
  addressStaker.items.push(stakeItem);

  addressStaker.items.map(item => ({ ...item, portion: Number(item.stake / addressStaker.total) }));
  addressStaker.items.sort((a, b) => a.portion - b.portion);
  addressStaker.items.map((item, index) => ({ ...item, rank: index }));

  await setStakerByAddress(stateStore, address, addressStaker);
};

export const subtractStakeByAddress = async (
  stateStore: StateStore,
  address: string,
  stakeItem: StakerItemAsset,
) => {
  const addressStaker = await getStakerByAddress(stateStore, address);
  if (!addressStaker) {
    throw new Error('staker data for address not found');
  }
  const index = addressStaker.items.findIndex(
    t => t.persona === stakeItem.persona && t.stake === stakeItem.stake,
  );
  if (index === -1) {
    throw new Error('stake data is invalid');
  }
  addressStaker.total -= stakeItem.stake;
  addressStaker.items.splice(index, 1);

  addressStaker.items.map(item => ({ ...item, portion: Number(item.stake / addressStaker.total) }));
  addressStaker.items.sort((a, b) => a.portion - b.portion);
  addressStaker.items.map((item, i) => ({ ...item, rank: i }));

  await setStakerByAddress(stateStore, address, addressStaker);
};
