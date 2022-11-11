import fetch from 'node-fetch';

export const IPFS_GATEWAY = '.ipfs.nftstorage.link';

export function urlGetIPFS(hash: string, gateway: string = IPFS_GATEWAY) {
  return encodeURI(`https://${hash}${gateway}`);
}

export async function fetchIPFS(hash: string) {
  const res = await fetch(urlGetIPFS(hash));
  return res;
}
