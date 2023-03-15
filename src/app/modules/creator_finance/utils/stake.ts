import { codec, StateStore, BaseModuleDataAccess, ReducerHandler } from 'lisk-sdk';
import { CreaFiAccountProps } from 'enevti-types/account/profile';
import BigNumber from 'bignumber.js';
import { StakerChain, StakerItemUtils } from 'enevti-types/chain/stake';
import { AddActivityParam } from 'enevti-types/param/activity';
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

export const initStakeByAddress = async (stateStore: StateStore, address: string) => {
  await setStakerByAddress(stateStore, address, { total: BigInt(0), items: [] });
};

export const addStakeByAddress = async (
  stateStore: StateStore,
  reducerHandler: ReducerHandler,
  address: string,
  stakeItem: StakerItemUtils,
) => {
  const addressStaker = await getStakerByAddress(stateStore, address);
  if (!addressStaker) {
    throw new Error('staker data for address not found');
  }
  addressStaker.total += stakeItem.stake;
  let stakerItems = addressStaker.items.concat({ ...stakeItem, rank: 0, portion: 0 });

  stakerItems = stakerItems.map(item => ({
    ...item,
    portion: Number(
      new BigNumber((item.stake * BigInt(10000)).toString())
        .div(addressStaker.total.toString())
        .toFixed(0),
    ),
  }));
  stakerItems.sort((a, b) => b.portion - a.portion);
  stakerItems = stakerItems.map((item, index) => ({ ...item, rank: index + 1 }));

  addressStaker.items = stakerItems.slice();
  await reducerHandler.invoke('activity:addActivity', {
    newState: addressStaker,
    oldState: await getStakerByAddress(stateStore, address),
    payload: {
      key: `stakePool:${address}`,
      type: 'stakeChanged',
      transaction: stakeItem.id,
      amount: stakeItem.stake,
    },
  } as AddActivityParam);
  await setStakerByAddress(stateStore, address, addressStaker);

  const addressAccount = await stateStore.account.get<CreaFiAccountProps>(
    Buffer.from(address, 'hex'),
  );
  addressAccount.creatorFinance.totalStake = addressStaker.total;
  await stateStore.account.set(Buffer.from(address, 'hex'), addressAccount);
};

export const subtractStakeByAddress = async (
  stateStore: StateStore,
  reducerHandler: ReducerHandler,
  address: string,
  stakeItem: StakerItemUtils,
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
  let stakerItems = [...addressStaker.items];
  stakerItems.splice(index, 1);

  stakerItems = stakerItems.map(item => ({
    ...item,
    portion: Number(
      new BigNumber((item.stake * BigInt(10000)).toString())
        .div(addressStaker.total.toString())
        .toFixed(0),
    ),
  }));
  stakerItems.sort((a, b) => b.portion - a.portion);
  stakerItems = stakerItems.map((item, i) => ({ ...item, rank: i }));

  addressStaker.items = stakerItems.slice();
  await reducerHandler.invoke('activity:addActivity', {
    newState: addressStaker,
    oldState: await getStakerByAddress(stateStore, address),
    payload: {
      key: `stakePool:${address}`,
      type: 'stakeChanged',
      transaction: stakeItem.id,
      amount: stakeItem.stake,
    },
  } as AddActivityParam);
  await setStakerByAddress(stateStore, address, addressStaker);

  const addressAccount = await stateStore.account.get<CreaFiAccountProps>(
    Buffer.from(address, 'hex'),
  );
  addressAccount.creatorFinance.totalStake = addressStaker.total;
  await stateStore.account.set(Buffer.from(address, 'hex'), addressAccount);
};
