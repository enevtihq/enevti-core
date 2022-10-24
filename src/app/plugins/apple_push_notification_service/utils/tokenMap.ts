import { codec, db } from 'lisk-sdk';
import { DB_KEY_TOKEN_TO_ADDRESS_MAP } from '../constant/codec';
import { TokenToAddressMap, tokenToAddressSchema } from '../schema/tokenToAddressSchema';
import { getDB, setDB } from './db';

export async function getTokenMap(
  dbInstance: db.KVStore,
  token: string,
): Promise<TokenToAddressMap> {
  const tokenToAddressBuffer = await getDB(dbInstance, `${DB_KEY_TOKEN_TO_ADDRESS_MAP}:${token}`);
  if (!tokenToAddressBuffer) {
    return { address: '' };
  }
  return codec.decode<TokenToAddressMap>(tokenToAddressSchema, tokenToAddressBuffer);
}

export async function setTokenMap(
  dbInstance: db.KVStore,
  token: string,
  map: TokenToAddressMap,
): Promise<void> {
  await setDB(
    dbInstance,
    `${DB_KEY_TOKEN_TO_ADDRESS_MAP}:${token}`,
    codec.encode(tokenToAddressSchema, map),
  );
}
