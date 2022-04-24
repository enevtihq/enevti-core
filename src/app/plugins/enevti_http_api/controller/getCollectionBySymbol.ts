import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import {
  invokeGetCollection,
  invokeGetCollectionIdFromSymbol,
} from '../utils/hook/redeemable_nft_module';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const id = await invokeGetCollectionIdFromSymbol(channel, symbol);
    if (!id) {
      res.status(404).json('Not Found');
      return;
    }
    const collection = await invokeGetCollection(channel, id.toString('hex'));

    res.status(200).json({ data: collection, meta: {} });
  } catch (err: unknown) {
    res.status(409).json(err);
  }
};
