import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { invokeGetAllNFT } from '../utils/hook/redeemable_nft_module';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { offset, limit } = req.params;
    const nfts = await invokeGetAllNFT(channel, parseInt(offset, 10), parseInt(limit, 10));

    res.status(200).json({ data: nfts, meta: {} });
  } catch (err: unknown) {
    res.status(409).json(err);
  }
};
