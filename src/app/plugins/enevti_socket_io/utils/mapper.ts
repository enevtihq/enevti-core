const addressToId: { [address: string]: string } = {};
const idToAddress: { [socketId: string]: string } = {};

export const getSocketIdByAddress = (address: string) => addressToId[address];

export const getAddressBySocketId = (socketId: string) => idToAddress[socketId];

export const mapAddress = (address: string, socketId: string) => {
  if (getSocketIdByAddress(address) !== undefined || getAddressBySocketId(socketId) !== undefined) {
    return;
  }
  addressToId[address] = socketId;
  idToAddress[socketId] = address;
};

export const removeMapByAddress = (address: string) => {
  delete idToAddress[getSocketIdByAddress(address)];
  delete addressToId[address];
};

export const removeMapBySocket = (socketId: string) => {
  delete addressToId[getAddressBySocketId(socketId)];
  delete idToAddress[socketId];
};
