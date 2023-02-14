import { codec, StateStore, BaseModuleDataAccess } from 'lisk-sdk';
import { RegisteredNameAsset } from 'enevti-types/chain/registrar';

export const accessRegistrar = async (
  dataAccess: BaseModuleDataAccess,
  identifier: string,
  value: string,
): Promise<RegisteredNameAsset | undefined> => {
  const registeredNameBuffer = await dataAccess.getChainState(
    `${CHAIN_STATE_REGISTRAR_NAME}:${name}`,
  );
  if (!registeredNameBuffer) {
    return undefined;
  }
  return codec.decode<RegisteredNameAsset>(registeredNameSchema, registeredNameBuffer);
};

export const getRegisteredName = async (
  stateStore: StateStore,
  name: string,
): Promise<RegisteredNameAsset | undefined> => {
  const registeredNameBuffer = await stateStore.chain.get(`${CHAIN_STATE_REGISTRAR_NAME}:${name}`);
  if (!registeredNameBuffer) {
    return undefined;
  }
  return codec.decode<RegisteredNameAsset>(registeredNameSchema, registeredNameBuffer);
};

export const setRegisteredName = async (stateStore: StateStore, name: string, id: string) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_REGISTRAR_NAME}:${name}`,
    codec.encode(registeredNameSchema, { id: Buffer.from(id, 'hex') }),
  );
};

export const accessRegisteredSymbol = async (
  dataAccess: BaseModuleDataAccess,
  symbol: string,
): Promise<RegisteredSymbolAsset | undefined> => {
  const registeredSymbolBuffer = await dataAccess.getChainState(
    `${CHAIN_STATE_REGISTRAR_SYMBOL}:${symbol}`,
  );
  if (!registeredSymbolBuffer) {
    return undefined;
  }
  return codec.decode<RegisteredSymbolAsset>(registeredSymbolSchema, registeredSymbolBuffer);
};

export const getRegisteredSymbol = async (
  stateStore: StateStore,
  symbol: string,
): Promise<RegisteredSymbolAsset | undefined> => {
  const registeredSymbolBuffer = await stateStore.chain.get(
    `${CHAIN_STATE_REGISTRAR_SYMBOL}:${symbol}`,
  );
  if (!registeredSymbolBuffer) {
    return undefined;
  }
  return codec.decode<RegisteredSymbolAsset>(registeredSymbolSchema, registeredSymbolBuffer);
};

export const setRegisteredSymbol = async (stateStore: StateStore, symbol: string, id: string) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_REGISTRAR_SYMBOL}:${symbol}`,
    codec.encode(registeredSymbolSchema, { id: Buffer.from(id, 'hex') }),
  );
};

export const accessRegisteredSerial = async (
  dataAccess: BaseModuleDataAccess,
  serial: string,
): Promise<RegisteredSerialAsset | undefined> => {
  const registeredSerialBuffer = await dataAccess.getChainState(
    `${CHAIN_STATE_REGISTRAR_SERIAL}:${serial}`,
  );
  if (!registeredSerialBuffer) {
    return undefined;
  }
  return codec.decode<RegisteredSerialAsset>(registeredSerialSchema, registeredSerialBuffer);
};

export const getRegisteredSerial = async (
  stateStore: StateStore,
  serial: string,
): Promise<RegisteredSerialAsset | undefined> => {
  const registeredSerialBuffer = await stateStore.chain.get(
    `${CHAIN_STATE_REGISTRAR_SERIAL}:${serial}`,
  );
  if (!registeredSerialBuffer) {
    return undefined;
  }
  return codec.decode<RegisteredSerialAsset>(registeredSerialSchema, registeredSerialBuffer);
};

export const setRegisteredSerial = async (stateStore: StateStore, serial: string, id: string) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_REGISTRAR_SERIAL}:${serial}`,
    codec.encode(registeredSerialSchema, { id: Buffer.from(id, 'hex') }),
  );
};
