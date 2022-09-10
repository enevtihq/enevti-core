const addressToCallId: { [address: string]: string } = {};

export const getCallIdByAddress = (address: string) => addressToCallId[address];

export const mapAddressToCallId = (address: string, callId: string) => {
  addressToCallId[address] = callId;
};

export const removeCallIdMapByAddress = (address: string) => {
  delete addressToCallId[address];
};
