const addressToRejectableCallId: { [address: string]: string } = {};

export const getRejectableCallIdByAddress = (address: string) => addressToRejectableCallId[address];

export const mapAddressToRejectableCallId = (address: string, callId: string) => {
  addressToRejectableCallId[address] = callId;
};

export const removeRejectableCallIdMapByAddress = (address: string) => {
  delete addressToRejectableCallId[address];
};
