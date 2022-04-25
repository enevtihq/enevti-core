import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { invokeIsSerialExists } from '../utils/hook/redeemable_nft_module';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { serial } = req.params;
    const isSerialExists = await invokeIsSerialExists(channel, serial);

    res.status(200).json({ data: isSerialExists, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: err, meta: req.params });
  }
};
