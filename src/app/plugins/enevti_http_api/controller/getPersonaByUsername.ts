import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import * as Lisk from 'lisk-sdk';
import { Persona } from '../../../../types/core/account/persona';
import { invokeGetAccount, invokeGetAddressByUsername } from '../utils/hook/persona_module';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const usernameRegistrar = await invokeGetAddressByUsername(channel, username);
    if (!usernameRegistrar) {
      res.status(404).json({ data: { message: 'Not Found' }, meta: req.params });
      return;
    }
    const account = await invokeGetAccount(channel, usernameRegistrar.address.toString('hex'));

    const persona: Persona = {
      address: usernameRegistrar.address.toString('hex'),
      base32: Lisk.cryptography.getBase32AddressFromAddress(usernameRegistrar.address),
      photo: account.persona.photo,
      username: account.persona.username,
    };

    res.status(200).json({ data: persona, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: err, meta: req.params });
  }
};
