import { Account } from '@liskhq/lisk-chain';
import { BaseChannel } from 'lisk-framework';
import { DPOSAccountProps } from 'lisk-framework/dist-node/modules/dpos';
import * as Lisk from 'lisk-sdk';
import { Persona, PersonaAccountProps } from '../../../../types/core/account/persona';

export default async function addressBufferToPersona(
  channel: BaseChannel,
  address: Buffer,
): Promise<Persona> {
  const ownerAccount = await channel.invoke<PersonaAccountProps & Account & DPOSAccountProps>(
    'persona:getAccount',
    { address: address.toString('hex') },
  );
  const persona: Persona = {
    address: ownerAccount.address.toString('hex'),
    base32: Lisk.cryptography.getBase32AddressFromAddress(ownerAccount.address),
    photo: ownerAccount.persona.photo,
    username: ownerAccount.dpos.delegate.username,
  };
  return persona;
}
