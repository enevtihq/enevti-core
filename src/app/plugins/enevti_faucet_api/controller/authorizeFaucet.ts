import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { password, enable } = req.body as Record<string, string>;
    const authorize = await channel.invoke('faucet:authorize', {
      // alphanet configuration
      password,
      enable: enable === 'true',
    });
    res.status(200).json({ data: authorize, meta: req.body as Record<string, string> });
  } catch (err: unknown) {
    res
      .status(409)
      .json({ data: (err as string).toString(), meta: req.body as Record<string, string> });
  }
};
