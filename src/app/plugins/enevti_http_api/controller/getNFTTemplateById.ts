import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const template = await channel.invoke('redeemableNft:getNFTTemplateById', { id });

    res.status(200).json({ data: template, meta: {} });
  } catch (err: unknown) {
    res.status(409).json(err);
  }
};
