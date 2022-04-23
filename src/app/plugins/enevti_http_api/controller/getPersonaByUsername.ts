import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import * as Lisk from 'lisk-sdk';
import { Persona, PersonaAccountProps } from '../../../../types/core/account/persona';
import { RegisteredUsernameAsset } from '../../../../types/core/chain/registrar';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const usernameRegistrar = await channel.invoke<RegisteredUsernameAsset>(
      'persona:getAddressByUsername',
      { username },
    );
    const account = await channel.invoke<PersonaAccountProps>('persona:getAccount', {
      address: usernameRegistrar.address.toString('hex'),
    });

    const persona: Persona = {
      address: usernameRegistrar.address.toString('hex'),
      base32: Lisk.cryptography.getBase32AddressFromAddress(usernameRegistrar.address),
      photo: account.persona.photo,
      username: account.persona.username,
    };

    res.status(200).json({ data: persona, meta: {} });
  } catch (err: unknown) {
    res.status(409).json(err);
  }
};
