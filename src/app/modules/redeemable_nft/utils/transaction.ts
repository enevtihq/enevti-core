import { cryptography, StateStore } from 'lisk-sdk';

/* get block timestamp in miliseconds (chain timestamp are in seconds) */
export const getBlockTimestamp = (stateStore: StateStore): number =>
  stateStore.chain.lastBlockHeaders[0].timestamp * 1000;

export const getNetworkIdentifier = (stateStore: StateStore): string =>
  stateStore.chain.networkIdentifier.toString('hex');

export const generateID = (source: Buffer, nonce: bigint): Buffer => {
  const nonceBuffer = Buffer.alloc(8);
  nonceBuffer.writeBigInt64LE(nonce);
  const seed = Buffer.concat([source, nonceBuffer]);
  return cryptography.hash(seed);
};

export async function asyncForEach<T>(
  array: T[],
  callback: (item: T, index: number, array: T[]) => Promise<void>,
) {
  for (let index = 0; index < array.length; index += 1) {
    await callback(array[index], index, array);
  }
}
