import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { Collection } from '../../../../../types/core/chain/collection';
import collectionChainToUI from '../../utils/transformer/collectionChainToUI';
import {
  invokeGetAllCollection,
  invokeGetCollectionLike,
} from '../../utils/hook/redeemable_nft_module';
import idBufferToActivityCollection from '../../utils/transformer/idBufferToActivityCollection';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { offset, limit, version, viewer } = req.query as Record<string, string>;
    const collections = await invokeGetAllCollection(
      channel,
      offset ? parseInt(offset, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
      version ? parseInt(version, 10) : undefined,
    );

    const response: (Collection & { liked: boolean })[] = await Promise.all(
      collections.data.map(
        async (item): Promise<Collection & { liked: boolean }> => {
          let liked = false;
          if (viewer) {
            const likeCollectionAsset = await invokeGetCollectionLike(
              channel,
              item.id.toString('hex'),
            );
            if (likeCollectionAsset) {
              liked =
                likeCollectionAsset.address.findIndex(
                  t => Buffer.compare(Buffer.from(viewer, 'hex'), t) === 0,
                ) !== -1;
            }
          }
          const activity = await idBufferToActivityCollection(channel, item.id);
          const restCollection = await collectionChainToUI(channel, item);
          return {
            ...item,
            ...restCollection,
            activity,
            liked,
          };
        },
      ),
    );

    res.status(200).json({ data: response, meta: req.query });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.query });
  }
};
