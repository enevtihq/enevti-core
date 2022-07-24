import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import * as Lisk from 'lisk-sdk';
import { Persona } from '../../../../../types/core/account/persona';
import { BASE32_PREFIX } from '../../constant/base32prefix';
import { invokeGetAccount, invokeGetAddressByUsername } from '../../utils/hook/persona_module';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { q } = req.query as Record<string, string>;
    const usernameRegistrar = await invokeGetAddressByUsername(channel, q);
    if (!usernameRegistrar) {
      res.status(200).json({ data: [], meta: req.query });
      return;
    }
    const account = await invokeGetAccount(channel, usernameRegistrar.toString('hex'));

    const response: Persona[] = [
      {
        address: usernameRegistrar.toString('hex'),
        base32: Lisk.cryptography.getBase32AddressFromAddress(usernameRegistrar, BASE32_PREFIX),
        photo: account.persona.photo,
        username: account.persona.username,
      },
    ];

    res.status(200).json({ data: response, meta: req.query });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.query });
  }
};
