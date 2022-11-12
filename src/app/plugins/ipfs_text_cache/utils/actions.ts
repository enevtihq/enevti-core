import { db } from 'lisk-sdk';
import { IPFSTextCache } from '../schema/ipfsTextCacheSchema';
import { getIPFSTextCacheDB, setIPFSTextCacheDB } from './ipfsTextCache';

export async function getIPFSTextCache(
  dbInstance: db.KVStore,
  hash: string,
): Promise<IPFSTextCache | undefined> {
  const ipfsTextCache = await getIPFSTextCacheDB(dbInstance, hash);
  return ipfsTextCache;
}

export async function setIPFSTextCache(
  dbInstance: db.KVStore,
  hash: string,
  cache: IPFSTextCache,
): Promise<void> {
  await setIPFSTextCacheDB(dbInstance, hash, cache);
}
