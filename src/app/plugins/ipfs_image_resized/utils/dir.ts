import * as os from 'os';
import * as fsExtra from 'fs-extra';
import * as path from 'path';

// eslint-disable-next-line
const pJSON = require('../../../../../package.json') as Record<string, unknown>;

export async function getPluginsDirectory() {
  const dataPath = `~/.lisk/${pJSON.name as string}/`;
  const baseDir = 'ipfsImageResized/';
  const dirPath = path.join(dataPath.replace('~', os.homedir()), 'plugins/data', baseDir);
  await fsExtra.ensureDir(dirPath);
  return dirPath;
}
