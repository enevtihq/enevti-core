/* eslint-disable @typescript-eslint/no-non-null-assertion */
type CallStatus = 'ready' | 'connected' | 'in-progress' | 'disconnected';
type CallRegistryState = { address: string; audio?: boolean; video?: boolean; status?: CallStatus };
type CallRegistryToken = { nftId?: string; twilioToken?: string };

const callRegistry: {
  [callId: string]: { token?: CallRegistryToken; state?: CallRegistryState[] };
} = {};

export const getCallRegistry = (callId: string) => callRegistry[callId];

export const initCallRegistry = (callId: string, address: string) => {
  if (callRegistry[callId] === undefined) {
    callRegistry[callId] = { token: {}, state: [] };
  } else {
    const index = callRegistry[callId].state!.findIndex(t => t.address === address);
    if (index !== -1) return;
  }
  callRegistry[callId].state?.push({ address, audio: true, video: true, status: 'ready' });
};

export const setCallRegistryToken = (callId: string, token: CallRegistryToken) => {
  if (callRegistry[callId] === undefined || callRegistry[callId].token === undefined) return;
  Object.assign(callRegistry[callId].token!, token);
};

export const setCallRegistry = (
  callId: string,
  { address, audio, video, status }: CallRegistryState,
) => {
  if (!callRegistry[callId].state) callRegistry[callId].state = [];
  const index = callRegistry[callId].state!.findIndex(t => t.address === address);
  if (index !== -1) {
    Object.assign(callRegistry[callId].state![index], { address, audio, video, status });
  } else {
    callRegistry[callId].state!.push({ address, audio, video, status });
  }
};

export const setCallRegistryStatus = (
  callId: string,
  address: string,
  status: CallRegistryState['status'],
) => {
  setCallRegistry(callId, { address, status });
};

export const setAllCallRegistryStatus = (callId: string, status: CallRegistryState['status']) => {
  if (callRegistry[callId].state) {
    for (const state of callRegistry[callId].state!) {
      state.status = status;
    }
  }
};

export const removeCallRegistry = (callId: string) => {
  delete callRegistry[callId];
};
