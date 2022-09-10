const socketToAddress: { [socket: string]: string } = {};

export const getAddressBySocket = (socket: string) => socketToAddress[socket];

export const mapSocketToAddress = (socket: string, address: string) => {
  socketToAddress[socket] = address;
};

export const removeAddressMapBySocket = (socket: string) => {
  delete socketToAddress[socket];
};
