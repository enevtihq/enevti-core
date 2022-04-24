import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import {
  invokeGetCollection,
  invokeGetCollectionIdFromName,
} from '../utils/hook/redeemable_nft_module';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const id = await invokeGetCollectionIdFromName(channel, name);
    if (!id) {
      res.status(404).json('Not Found');
      return;
    }
    const collection = invokeGetCollection(channel, id.toString('hex'));

    res.status(200).json({ data: collection, meta: {} });
  } catch (err: unknown) {
    res.status(409).json(err);
  }
};
