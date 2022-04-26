import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { Collection } from '../../../../types/core/chain/collection';
import collectionChainToUI from '../utils/transformer/collectionChainToUI';
import { invokeGetAllCollection } from '../utils/hook/redeemable_nft_module';
import idBufferToActivityCollection from '../utils/transformer/idBufferToActivityCollection';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { offset, limit } = req.params;
    const collections = await invokeGetAllCollection(
      channel,
      parseInt(offset, 10),
      parseInt(limit, 10),
    );

    const response: Collection[] = await Promise.all(
      collections.map(
        async (item): Promise<Collection> => {
          const activity = await idBufferToActivityCollection(channel, item.id);
          const restCollection = await collectionChainToUI(channel, item);
          return {
            ...item,
            ...restCollection,
            activity,
          };
        },
      ),
    );

    res.status(200).json({ data: response, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: err, meta: req.params });
  }
};
