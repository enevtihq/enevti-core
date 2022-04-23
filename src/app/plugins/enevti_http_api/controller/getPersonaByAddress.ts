import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import * as Lisk from 'lisk-sdk';
import { Persona, PersonaAccountProps } from '../../../../types/core/account/persona';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const account = await channel.invoke<PersonaAccountProps>('persona:getAccount', { address });

    const persona: Persona = {
      address,
      base32: Lisk.cryptography.getBase32AddressFromAddress(Buffer.from(address, 'hex')),
      photo: account.persona.photo,
      username: account.persona.username,
    };

    res.status(200).json({ data: persona, meta: {} });
  } catch (err: unknown) {
    res.status(409).json(err);
  }
};
