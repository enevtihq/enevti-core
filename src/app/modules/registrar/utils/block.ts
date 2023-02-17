import { BlockRegisrarChain } from 'enevti-types/chain/registrar';
import { codec, StateStore, BaseModuleDataAccess } from 'lisk-sdk';
import { BLOCK_REGISTRAR_PREFIX, REGISTRAR_PREFIX } from '../constants/codec';
import { blockRegistrarSchema } from '../schema/block';

export const accessBlockRegistrar = async (
  dataAccess: BaseModuleDataAccess,
  height: number,
): Promise<BlockRegisrarChain | undefined> => {
  const blockRegistrarBuffer = await dataAccess.getChainState(
    `${REGISTRAR_PREFIX}:${BLOCK_REGISTRAR_PREFIX}:${height}`,
  );
  if (!blockRegistrarBuffer) {
    return undefined;
  }
  return codec.decode<BlockRegisrarChain>(blockRegistrarSchema, blockRegistrarBuffer);
};

export const getBlockRegistrar = async (
  stateStore: StateStore,
  height: number,
): Promise<BlockRegisrarChain | undefined> => {
  const blockRegistrarBuffer = await stateStore.chain.get(
    `${REGISTRAR_PREFIX}:${BLOCK_REGISTRAR_PREFIX}:${height}`,
  );
  if (!blockRegistrarBuffer) {
    return undefined;
  }
  return codec.decode<BlockRegisrarChain>(blockRegistrarSchema, blockRegistrarBuffer);
};

export const setBlockRegistrar = async (
  stateStore: StateStore,
  height: number,
  blockRegistrar: BlockRegisrarChain,
) => {
  await stateStore.chain.set(
    `${REGISTRAR_PREFIX}:${BLOCK_REGISTRAR_PREFIX}:${height}`,
    codec.encode(blockRegistrarSchema, blockRegistrar),
  );
};
