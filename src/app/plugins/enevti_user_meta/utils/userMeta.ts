import { codec, db } from 'lisk-sdk';
import { DB_KEY_ENEVTI_USER_META } from '../constant/codec';
import { EnevtiUserMeta, enevtiUserMetaSchema } from '../schema/enevtiUserMetaSchema';
import { getDB, setDB } from './db';

export async function getUserMetaDB(
  dbInstance: db.KVStore,
  address: string,
): Promise<EnevtiUserMeta | undefined> {
  const enevtiUserMetaBuffer = await getDB(dbInstance, `${DB_KEY_ENEVTI_USER_META}:${address}`);
  if (!enevtiUserMetaBuffer) {
    return undefined;
  }
  return codec.decode<EnevtiUserMeta>(enevtiUserMetaSchema, enevtiUserMetaBuffer);
}

export async function setUserMetaDB(
  dbInstance: db.KVStore,
  address: string,
  meta: EnevtiUserMeta,
): Promise<void> {
  await setDB(
    dbInstance,
    `${DB_KEY_ENEVTI_USER_META}:${address}`,
    codec.encode(enevtiUserMetaSchema, meta),
  );
}
