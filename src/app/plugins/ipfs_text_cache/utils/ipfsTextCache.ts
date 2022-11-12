import { codec, db } from 'lisk-sdk';
import { DB_KEY_IPFS_TEXT_CACHE } from '../constant/codec';
import { IPFSTextCache, ipfsTextCacheSchema } from '../schema/ipfsTextCacheSchema';
import { getDB, setDB } from './db';

export async function getIPFSTextCacheDB(
  dbInstance: db.KVStore,
  hash: string,
): Promise<IPFSTextCache | undefined> {
  const ipfsTextCacheBuffer = await getDB(dbInstance, `${DB_KEY_IPFS_TEXT_CACHE}:${hash}`);
  if (!ipfsTextCacheBuffer) {
    return undefined;
  }
  return codec.decode<IPFSTextCache>(ipfsTextCacheSchema, ipfsTextCacheBuffer);
}

export async function setIPFSTextCacheDB(
  dbInstance: db.KVStore,
  hash: string,
  cache: IPFSTextCache,
): Promise<void> {
  await setDB(
    dbInstance,
    `${DB_KEY_IPFS_TEXT_CACHE}:${hash}`,
    codec.encode(ipfsTextCacheSchema, cache),
  );
}
