const addressToPublicKey: { [address: string]: string } = {};

export const getPublicKeyByAddress = (address: string) => addressToPublicKey[address];

export const mapAddressToPublicKey = (address: string, publicKey: string) => {
  addressToPublicKey[address] = publicKey;
};

export const removePublicKeyMapByAddress = (address: string) => {
  delete addressToPublicKey[address];
};
