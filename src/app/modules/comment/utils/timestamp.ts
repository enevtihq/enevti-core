import { StateStore } from 'lisk-framework';

/* get block timestamp in second */
export const getBlockTimestamp = (stateStore: StateStore): number =>
  stateStore.chain.lastBlockHeaders[0].timestamp;
