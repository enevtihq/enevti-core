import { cryptography, StateStore, Transaction } from 'lisk-sdk';

/* get block timestamp in miliseconds (chain timestamp are in seconds) */
export const getBlockTimestamp = (stateStore: StateStore): number =>
  stateStore.chain.lastBlockHeaders[0].timestamp * 1000;

export const getNetworkIdentifier = (stateStore: StateStore): Buffer =>
  stateStore.chain.networkIdentifier;

export const generateID = (
  transaction: Transaction,
  stateStore: StateStore,
  index: bigint,
): Buffer => {
  const nonceBuffer = Buffer.alloc(8);
  nonceBuffer.writeBigInt64LE(transaction.nonce);
  const indexBuffer = Buffer.alloc(8);
  indexBuffer.writeBigInt64LE(index);
  const seed = Buffer.concat([
    stateStore.chain.networkIdentifier,
    transaction.senderAddress,
    nonceBuffer,
    indexBuffer,
  ]);
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
