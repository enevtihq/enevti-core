import { ServeRateChain } from 'enevti-types/chain/redeemable_nft';
import { BaseModuleDataAccess, codec, StateStore } from 'lisk-sdk';
import { CHAIN_STATE_SERVE_RATE } from '../constants/codec';
import { serveRateSchema } from '../schemas/chain/serveRate';

export const accessServeRate = async (
  dataAccess: BaseModuleDataAccess,
  address: Buffer,
): Promise<ServeRateChain | undefined> => {
  const serveRateBuffer = await dataAccess.getChainState(
    `${CHAIN_STATE_SERVE_RATE}:${address.toString('hex')}`,
  );
  if (!serveRateBuffer) {
    return undefined;
  }
  return codec.decode<ServeRateChain>(serveRateSchema, serveRateBuffer);
};

export const getServeRate = async (
  stateStore: StateStore,
  address: Buffer,
): Promise<ServeRateChain | undefined> => {
  const serveRateBuffer = await stateStore.chain.get(
    `${CHAIN_STATE_SERVE_RATE}:${address.toString('hex')}`,
  );
  if (!serveRateBuffer) {
    return undefined;
  }
  return codec.decode<ServeRateChain>(serveRateSchema, serveRateBuffer);
};

export const setServeRate = async (
  stateStore: StateStore,
  address: Buffer,
  serveRate: ServeRateChain,
) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_SERVE_RATE}:${address.toString('hex')}`,
    codec.encode(serveRateSchema, serveRate),
  );
};
