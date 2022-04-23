import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';

export default (channel: BaseChannel) => async (_: Request, res: Response) => {
  try {
    const template = await channel.invoke('redeemableNft:getAllNFTTemplate');

    res.status(200).json({ data: template, meta: {} });
  } catch (err: unknown) {
    res.status(409).json(err);
  }
};
