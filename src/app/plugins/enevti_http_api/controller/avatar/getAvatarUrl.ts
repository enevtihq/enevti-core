import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import addressBufferToPersona from '../../utils/transformer/addressBufferToPersona';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const profile = await addressBufferToPersona(channel, Buffer.from(address, 'hex'));
    const url = `/avatar/${profile.base32}`;

    res.status(200).json({ data: url, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
