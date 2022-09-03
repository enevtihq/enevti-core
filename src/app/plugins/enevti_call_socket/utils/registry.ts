/* eslint-disable @typescript-eslint/no-non-null-assertion */
type CallStatus = 'ready' | 'connected' | 'incall' | 'disconnected';

type CallRegistry = { address: string; audio?: boolean; video?: boolean; status?: CallStatus };

const callRegistry: { [callId: string]: { state?: CallRegistry[] } } = {};

export const getCallRegistry = (callId: string) => callRegistry[callId];

export const initCallRegistry = (callId: string, address: string) => {
  const index = callRegistry[callId].state!.findIndex(t => t.address === address);
  if (index !== -1) return;
  callRegistry[callId].state?.push({ address, audio: true, video: true, status: 'ready' });
};

export const setCallRegistry = (
  callId: string,
  { address, audio, video, status }: CallRegistry,
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
  status: CallRegistry['status'],
) => {
  setCallRegistry(callId, { address, status });
};

export const setAllCallRegistryStatus = (callId: string, status: CallRegistry['status']) => {
  if (callRegistry[callId].state) {
    for (const state of callRegistry[callId].state!) {
      state.status = status;
    }
  }
};

export const removeCallRegistry = (callId: string) => {
  delete callRegistry[callId];
};
