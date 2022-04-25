import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import * as Lisk from 'lisk-sdk';
import { Persona } from '../../../../types/core/account/persona';
import { invokeGetAccount } from '../utils/hook/persona_module';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const account = await invokeGetAccount(channel, address);

    const persona: Persona = {
      address,
      base32: Lisk.cryptography.getBase32AddressFromAddress(Buffer.from(address, 'hex')),
      photo: account.persona.photo,
      username: account.persona.username,
    };

    res.status(200).json({ data: persona, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: err, meta: req.params });
  }
};
