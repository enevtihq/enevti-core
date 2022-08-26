import { codec, db } from 'lisk-sdk';
import { DB_KEY_ADDRESS_TO_TOKEN_MAP } from '../constant/codec';
import { AddressToTokenMap, addressToTokenSchema } from '../schema/addressToTokenSchema';
import { getDB, setDB } from './db';

export async function getAddressMap(
  dbInstance: db.KVStore,
  address: string,
): Promise<AddressToTokenMap> {
  const addressToTokenBuffer = await getDB(dbInstance, `${DB_KEY_ADDRESS_TO_TOKEN_MAP}:${address}`);
  if (!addressToTokenBuffer) {
    return { token: '' };
  }
  return codec.decode<AddressToTokenMap>(addressToTokenSchema, addressToTokenBuffer);
}

export async function setAddressMap(
  dbInstance: db.KVStore,
  address: string,
  map: AddressToTokenMap,
): Promise<void> {
  await setDB(
    dbInstance,
    `${DB_KEY_ADDRESS_TO_TOKEN_MAP}:${address}`,
    codec.encode(addressToTokenSchema, map),
  );
}
