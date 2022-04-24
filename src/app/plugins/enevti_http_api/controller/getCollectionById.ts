import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { invokeGetCollection } from '../utils/hook/redeemable_nft_module';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const collection = await invokeGetCollection(channel, id);
    if (!collection) {
      res.status(404).json('Not Found');
      return;
    }

    res.status(200).json({ data: collection, meta: {} });
  } catch (err: unknown) {
    res.status(409).json(err);
  }
};
