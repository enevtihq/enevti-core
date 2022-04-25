import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { address } = req.body as Record<string, string>;
    const response = await channel.invoke('faucet:fundTokens', { address });
    res.status(200).json({ data: response, meta: req.body as Record<string, string> });
  } catch (err: unknown) {
    res.status(409).json({ data: err, meta: req.body as Record<string, string> });
  }
};
