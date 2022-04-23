import { codec, StateStore } from 'lisk-sdk';
import { RegisteredUsernameAsset } from '../../../../types/core/chain/registrar';
import { CHAIN_STATE_REGISTRAR_USERNAME } from '../constant/codec';
import { registeredUsernameSchema } from '../schema/chain/registrar';

export const getRegisteredUsername = async (
  stateStore: StateStore,
  username: string,
): Promise<RegisteredUsernameAsset | undefined> => {
  const addressChain = await stateStore.chain.get(`${CHAIN_STATE_REGISTRAR_USERNAME}:${username}`);
  if (!addressChain) {
    return undefined;
  }
  return codec.decode<RegisteredUsernameAsset>(registeredUsernameSchema, addressChain);
};

export const setRegisteredUsername = async (
  stateStore: StateStore,
  username: string,
  address: string,
) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_REGISTRAR_USERNAME}:${username}`,
    codec.encode(registeredUsernameSchema, { address: Buffer.from(address, 'hex') }),
  );
};
