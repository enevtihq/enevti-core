import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { Collection, CollectionActivity } from '../../../../../types/core/chain/collection';
import collectionChainToUI from '../../utils/transformer/collectionChainToUI';
import {
  invokeGetCollection,
  invokeGetCollectionIdFromName,
  invokeGetLiked,
} from '../../utils/invoker/redeemable_nft_module';
import { NFT } from '../../../../../types/core/chain/nft';
import {
  COLLECTION_ACTIVITY_INITIAL_LENGTH,
  COLLECTION_MINTED_INITIAL_LENGTH,
} from '../../constant/limit';
import idBufferToActivityCollection from '../../utils/transformer/idBufferToActivityCollection';
import idBufferToNFT from '../../utils/transformer/idBufferToNFT';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const { activity, minted, viewer } = req.query as Record<string, string>;
    const id = await invokeGetCollectionIdFromName(channel, name);
    if (!id) {
      res.status(404).json({ data: { message: 'Not Found' }, version: {}, meta: req.params });
      return;
    }
    const collection = await invokeGetCollection(channel, id.toString('hex'));
    if (!collection) {
      res.status(404).json({ data: { message: 'Not Found' }, version: {}, meta: req.params });
      return;
    }

    const restCollection = await collectionChainToUI(channel, collection, false);
    const liked = viewer
      ? (await invokeGetLiked(channel, collection.id.toString('hex'), viewer)) === 1
      : false;

    let activityVersion = 0;
    let activityData: CollectionActivity[] = [];
    if (activity === 'true') {
      const collectionActivity = await idBufferToActivityCollection(channel, id);
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
    res.status(409).json({ data: (err as string).toString(), version: {}, meta: req.params });
  }
};
