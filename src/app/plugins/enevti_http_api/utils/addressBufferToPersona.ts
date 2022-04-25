import { BaseChannel } from 'lisk-framework';
import * as Lisk from 'lisk-sdk';
import { Persona } from '../../../../types/core/account/persona';
import { invokeGetAccount } from './hook/persona_module';

export default async function addressBufferToPersona(
  channel: BaseChannel,
  address: Buffer,
): Promise<Persona> {
  const ownerAccount = await invokeGetAccount(channel, address.toString('hex'));
  const persona: Persona = {
    address: ownerAccount.address.toString('hex'),
    base32: Lisk.cryptography.getBase32AddressFromAddress(ownerAccount.address),
    photo: ownerAccount.persona.photo,
    username: ownerAccount.dpos.delegate.username,
  };
  return persona;
}
