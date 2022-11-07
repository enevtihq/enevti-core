import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { Collection, CollectionActivity } from '../../../../../types/core/chain/collection';
import collectionChainToUI from '../../utils/transformer/collectionChainToUI';
import { invokeGetCollection, invokeGetLiked } from '../../utils/invoker/redeemable_nft_module';
import {
  COLLECTION_ACTIVITY_INITIAL_LENGTH,
  COLLECTION_MINTED_INITIAL_LENGTH,
} from '../../constant/limit';
import idBufferToActivityCollection from '../../utils/transformer/idBufferToActivityCollection';
import idBufferToNFT from '../../utils/transformer/idBufferToNFT';
import { NFT } from '../../../../../types/core/chain/nft';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { viewer, activity, minted } = req.query as Record<string, string>;
    const collection = await invokeGetCollection(channel, id);
    if (!collection) {
      res.status(404).json({ data: { message: 'Not Found' }, meta: req.params });
      return;
    }

    const restCollection = await collectionChainToUI(channel, collection, false);
    const liked = viewer ? (await invokeGetLiked(channel, id, viewer)) === 1 : false;

    let activityVersion = 0;
    let activityData: CollectionActivity[] = [];
    if (activity === 'true') {
      const collectionActivity = await idBufferToActivityCollection(
        channel,
        Buffer.from(id, 'hex'),
      );
      activityData = collectionActivity.slice(0, COLLECTION_ACTIVITY_INITIAL_LENGTH);
      activityVersion = collectionActivity.length;
    }

    let mintedVersion = 0;
    let mintedData: Collection['minted'] = [];
    if (minted === 'true') {
      mintedVersion = collection.minted.length;
      mintedData = await Promise.all(
        collection.minted.slice(0, COLLECTION_MINTED_INITIAL_LENGTH).map(
          async (item): Promise<NFT> => {
            const nft = await idBufferToNFT(channel, item);
            if (!nft) throw new Error('NFT not found while iterating collection.minted');
            return nft;
          },
        ),
      );
    }

    const response: Collection & { liked: boolean } = {
      ...collection,
      ...restCollection,
      activity: activityData,
      minted: mintedData,
      liked,
    };

    const version = {
      activity: activityVersion,
      minted: mintedVersion,
    };

    res.status(200).json({ data: response, version, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
