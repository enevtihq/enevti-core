import { BlockRegisrarAsset } from 'enevti-types/chain/registrar';
import { codec, StateStore, BaseModuleDataAccess } from 'lisk-sdk';
import { REGISTRAR_PREFIX } from '../constants/codec';
import { blockRegistrarSchema } from '../schema/block';

export const accessBlockRegistrar = async (
  dataAccess: BaseModuleDataAccess,
  height: number,
): Promise<BlockRegisrarAsset | undefined> => {
  const blockRegistrarBuffer = await dataAccess.getChainState(
    `${REGISTRAR_PREFIX}:block:${height}`,
  );
  if (!blockRegistrarBuffer) {
    return undefined;
  }
  return codec.decode<BlockRegisrarAsset>(blockRegistrarSchema, blockRegistrarBuffer);
};

export const getBlockRegistrar = async (
  stateStore: StateStore,
  height: number,
): Promise<BlockRegisrarAsset | undefined> => {
  const blockRegistrarBuffer = await stateStore.chain.get(`${REGISTRAR_PREFIX}:block:${height}`);
  if (!blockRegistrarBuffer) {
    return undefined;
  }
  return codec.decode<BlockRegisrarAsset>(blockRegistrarSchema, blockRegistrarBuffer);
};

export const setBlockRegistrar = async (
  stateStore: StateStore,
  height: number,
  blockRegistrar: BlockRegisrarAsset,
) => {
  await stateStore.chain.set(
    `${REGISTRAR_PREFIX}:block:${height}`,
    codec.encode(blockRegistrarSchema, blockRegistrar),
  );
};
