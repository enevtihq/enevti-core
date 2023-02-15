import { RegistrarAsset } from 'enevti-types/chain/registrar';
import { codec, StateStore, BaseModuleDataAccess } from 'lisk-sdk';
import { REGISTRAR_PREFIX } from '../constants/codec';
import { registrarSchema } from '../schema/registrar';

export const accessRegistrar = async (
  dataAccess: BaseModuleDataAccess,
  identifier: string,
  value: string,
): Promise<RegistrarAsset | undefined> => {
  const registrarBuffer = await dataAccess.getChainState(
    `${REGISTRAR_PREFIX}:${identifier}:${value}`,
  );
  if (!registrarBuffer) {
    return undefined;
  }
  return codec.decode<RegistrarAsset>(registrarSchema, registrarBuffer);
};

export const getRegistrar = async (
  stateStore: StateStore,
  identifier: string,
  value: string,
): Promise<RegistrarAsset | undefined> => {
  const registrarBuffer = await stateStore.chain.get(`${REGISTRAR_PREFIX}:${identifier}:${value}`);
  if (!registrarBuffer) {
    return undefined;
  }
  return codec.decode<RegistrarAsset>(registrarSchema, registrarBuffer);
};

export const setRegistrar = async (
  stateStore: StateStore,
  identifier: string,
  value: string,
  registrar: RegistrarAsset,
) => {
  await stateStore.chain.set(
    `${REGISTRAR_PREFIX}:${identifier}:${value}`,
    codec.encode(registrarSchema, registrar),
  );
};
