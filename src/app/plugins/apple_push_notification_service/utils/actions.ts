import { db } from 'lisk-sdk';
import { getAddressMap, setAddressMap } from './addressMap';
import { getTokenMap, setTokenMap } from './tokenMap';

export async function getTokenByAddress(dbInstance: db.KVStore, address: string): Promise<string> {
  const addressToToken = await getAddressMap(dbInstance, address);
  return addressToToken.token;
}

export async function registerAddress(
  dbInstance: db.KVStore,
  address: string,
  token: string,
): Promise<void> {
  const tokenToAddress = await getTokenMap(dbInstance, token);
  if (tokenToAddress.address !== '') {
    await removeAddress(dbInstance, tokenToAddress.address);
  }
  await setTokenMap(dbInstance, token, { address });
  await setAddressMap(dbInstance, address, { token });
}

export async function removeAddress(dbInstance: db.KVStore, address: string): Promise<void> {
  await setAddressMap(dbInstance, address, { token: '' });
}

export async function isAddressRegistered(
  dbInstance: db.KVStore,
  address: string,
): Promise<boolean> {
  const addressToToken = await getAddressMap(dbInstance, address);
  return addressToToken.token !== '';
}
