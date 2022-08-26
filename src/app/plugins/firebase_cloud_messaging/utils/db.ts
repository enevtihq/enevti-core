import * as os from 'os';
import * as fsExtra from 'fs-extra';
import * as path from 'path';
import { db } from 'lisk-sdk';

// eslint-disable-next-line
const pJSON = require('../../../../../package.json') as Record<string, unknown>;

export const getDBInstance = async () => {
  const dataPath = `~/.lisk/${pJSON.name as string}/`;
  const dbName = 'fcmPlugin.db';
  const dirPath = path.join(dataPath.replace('~', os.homedir()), 'plugins/data', dbName);
  await fsExtra.ensureDir(dirPath);
  return new db.KVStore(dirPath);
};

export const setDB = async (dbInstance: db.KVStore, key: string, data: Buffer) => {
  await dbInstance.put(key, data);
};

export const getDB = async (dbInstance: db.KVStore, key: string) => {
  try {
    const data = await dbInstance.get(key);
    return data;
  } catch {
    return undefined;
  }
};
