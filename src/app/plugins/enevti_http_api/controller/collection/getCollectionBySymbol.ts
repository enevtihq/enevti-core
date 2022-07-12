import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { Collection } from '../../../../../types/core/chain/collection';
import collectionChainToUI from '../../utils/transformer/collectionChainToUI';
import {
  invokeGetCollection,
  invokeGetCollectionIdFromSymbol,
  invokeGetCollectionLike,
} from '../../utils/hook/redeemable_nft_module';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const { viewer } = req.query as Record<string, string>;
    const id = await invokeGetCollectionIdFromSymbol(channel, symbol);
    if (!id) {
      res.status(404).json({ data: { message: 'Not Found' }, meta: req.params });
      return;
    }
    const collection = await invokeGetCollection(channel, id.toString('hex'));
    if (!collection) {
      res.status(404).json({ data: { message: 'Not Found' }, meta: req.params });
      return;
    }

    const restCollection = await collectionChainToUI(channel, collection, false);
    let liked = false;
    if (viewer) {
      const likeCollectionAsset = await invokeGetCollectionLike(
        channel,
        collection.id.toString('hex'),
      );
      if (likeCollectionAsset) {
        liked =
          likeCollectionAsset.address.findIndex(
            t => Buffer.compare(Buffer.from(viewer, 'hex'), t) === 0,
          ) !== -1;
      }
    }
    const response: Collection & { liked: boolean } = {
      ...collection,
      ...restCollection,
      activity: [],
      liked,
    };

    res.status(200).json({ data: response, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
