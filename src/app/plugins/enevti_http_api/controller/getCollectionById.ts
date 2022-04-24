import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { Collection } from '../../../../types/core/chain/collection';
import collectionChainToUI from '../utils/collectionChainToUI';
import { invokeGetCollection } from '../utils/hook/redeemable_nft_module';
import idBufferToActivityCollection from '../utils/idBufferToActivityCollection';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const collection = await invokeGetCollection(channel, id);
    if (!collection) {
      res.status(404).json({ data: { message: 'Not Found' }, meta: req.params });
      return;
    }

    const activity = await idBufferToActivityCollection(channel, collection.id);
    const restCollection = await collectionChainToUI(channel, collection);
    const response: Collection = {
      ...collection,
      ...restCollection,
      activity,
    };

    res.status(200).json({ data: response, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: err, meta: req.params });
  }
};
