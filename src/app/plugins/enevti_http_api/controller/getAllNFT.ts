import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';

export default (channel: BaseChannel) => async (_: Request, res: Response) => {
  try {
    const nfts = await channel.invoke('redeemableNft:getAllNFTT');

    res.status(200).json({ data: nfts, meta: {} });
  } catch (err: unknown) {
    res.status(409).json(err);
  }
};
