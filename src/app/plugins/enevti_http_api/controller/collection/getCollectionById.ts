import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { Collection, CollectionActivity } from 'enevti-types/chain/collection';
import collectionChainToUI from '../../utils/transformer/collectionChainToUI';
import { invokeGetCollection, invokeGetLiked } from '../../utils/invoker/redeemable_nft_module';
import {
  COLLECTION_ACTIVITY_INITIAL_LENGTH,
  COLLECTION_MINTED_INITIAL_LENGTH,
  COLLECTION_MOMENT_INITIAL_LENGTH,
} from '../../constant/limit';
import idBufferToActivityCollection from '../../utils/transformer/idBufferToActivityCollection';
import idBufferToNFT from '../../utils/transformer/idBufferToNFT';
import { NFTBase } from 'enevti-types/chain/nft';
import { isNumeric } from '../../utils/validation/number';
import { idBufferToMomentAt } from '../../utils/transformer/idBufferToMomentAt';
import { minimizeMoment, minimizeNFT } from '../../utils/transformer/minimizeToBase';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { viewer, activity, minted, moment } = req.query as Record<string, string>;
    const collection = await invokeGetCollection(channel, id);
    if (!collection) {
      res.status(404).json({ data: { message: 'Not Found' }, version: {}, meta: req.params });
      return;
    }

    const restCollection = await collectionChainToUI(channel, collection, false);
    const liked = viewer ? (await invokeGetLiked(channel, id, viewer)) === 1 : false;

    let activityVersion = 0;
    let activityData: CollectionActivity[] = [];
    if (activity && isNumeric(activity)) {
      const collectionActivity = await idBufferToActivityCollection(
        channel,
        Buffer.from(id, 'hex'),
        viewer,
      );
      activityData = collectionActivity.slice(
        0,
        activity === '0' ? COLLECTION_ACTIVITY_INITIAL_LENGTH : parseInt(activity, 10),
      );
      activityVersion = collectionActivity.length;
    }

    let mintedVersion = 0;
    let mintedData: Collection['minted'] = [];
    if (minted && isNumeric(minted)) {
      mintedVersion = collection.minted.length;
      mintedData = await Promise.all(
        collection.minted
          .slice(0, minted === '0' ? COLLECTION_MINTED_INITIAL_LENGTH : parseInt(minted, 10))
          .map(
            async (item): Promise<NFTBase> => {
              const nft = await idBufferToNFT(channel, item, false, viewer);
              if (!nft) throw new Error('NFT not found while iterating collection.minted');
              return minimizeNFT(nft);
            },
          ),
      );
    }

    let momentVersion = 0;
    let momentData: Collection['moment'] = [];
    if (moment && isNumeric(moment)) {
      const collectionMoment = (
        await idBufferToMomentAt(channel, Buffer.from(id, 'hex'), viewer)
      ).map(momentItem => minimizeMoment(momentItem));
      momentData = collectionMoment.slice(
        0,
        moment === '0' ? COLLECTION_MOMENT_INITIAL_LENGTH : parseInt(moment, 10),
      );
      momentVersion = collectionMoment.length;
    }

    const response: Collection & { liked: boolean } = {
      ...collection,
      ...restCollection,
      activity: activityData,
      minted: mintedData,
      moment: momentData,
      liked,
    };

    const version = {
      activity: activityVersion,
      minted: mintedVersion,
      moment: momentVersion,
    };

    res.status(200).json({ data: response, version, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), version: {}, meta: req.params });
  }
};
