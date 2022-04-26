export function validateAddress(address: string) {
  if (address.length < 40) {
    throw new Error('address not valid');
  }
}
