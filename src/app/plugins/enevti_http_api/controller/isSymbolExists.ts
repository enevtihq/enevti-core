import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { invokeIsSymbolExists } from '../utils/hook/redeemable_nft_module';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const isSymbolExists = await invokeIsSymbolExists(channel, symbol);

    res.status(200).json({ data: isSymbolExists, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: err, meta: req.params });
  }
};
