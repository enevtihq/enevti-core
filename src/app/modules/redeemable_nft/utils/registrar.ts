import { codec, StateStore } from 'lisk-sdk';
import {
  CHAIN_STATE_REGISTRAR_NAME,
  CHAIN_STATE_REGISTRAR_SERIAL,
  CHAIN_STATE_REGISTRAR_SYMBOL,
} from '../constants/codec';
import {
  registeredNameSchema,
  registeredSerialSchema,
  registeredSymbolSchema,
} from '../schemas/chain/registrar';
import {
  RegisteredNameAsset,
  RegisteredSerialAsset,
  RegisteredSymbolAsset,
} from '../../../../types/core/chain/registrar';

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
