import { db } from 'lisk-sdk';
import { EnevtiUserMeta } from '../schema/enevtiUserMetaSchema';
import { getUserMetaDB, setUserMetaDB } from './userMeta';

export async function getEnevtiUserMeta(
  dbInstance: db.KVStore,
  address: string,
): Promise<EnevtiUserMeta | undefined> {
  const userMeta = await getUserMetaDB(dbInstance, address);
  return userMeta;
}

export async function setEnevtiUserMeta(
  dbInstance: db.KVStore,
  address: string,
  meta: EnevtiUserMeta,
): Promise<void> {
  await setUserMetaDB(dbInstance, address, meta);
}
