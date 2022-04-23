import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';

export default (channel: BaseChannel) => async (_: Request, res: Response) => {
  try {
    const collections = await channel.invoke('redeemableNft:getAllCollection');

    res.status(200).json({ data: collections, meta: {} });
  } catch (err: unknown) {
    res.status(409).json(err);
  }
};
