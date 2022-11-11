import * as fs from 'fs';
import * as path from 'path';
import { getPluginsDirectory } from './dir';
import { fetchIPFS } from './ipfs';
import { resizeImage, SizeCode, widthMap } from './resizer';

export async function isIpfsResized(hash: string) {
  const dir = await getPluginsDirectory();
  return fs.existsSync(`${dir}/${hash}/`);
}

export async function storeResizedImage(hash: string) {
  try {
    if (!(await isIpfsResized(hash))) {
      let status = false;
      const dir = await getPluginsDirectory();
      const ipfsResponse = await fetchIPFS(hash);
      if (ipfsResponse.status === 200) {
        const imgBuff = await ipfsResponse.buffer();
        for (const key of Object.keys(widthMap)) {
          resizeImage(imgBuff, key as SizeCode, `${dir}/${hash}/${key}.jpg`);
        }
        status = true;
      }
      return status;
    }
    return false;
  } catch {
    return false;
  }
}

export async function getIpfsResizedUri(hash: string, size: SizeCode) {
  if (await isIpfsResized(hash)) {
    const dir = await getPluginsDirectory();
    return path.join(dir, `${size}.jpg`);
  }
  return undefined;
}
