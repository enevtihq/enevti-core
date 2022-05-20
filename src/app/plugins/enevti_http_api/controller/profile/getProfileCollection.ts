import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';

import { invokeGetAccount } from '../../utils/hook/persona_module';
import { validateAddress } from '../../utils/validation/address';
import { CollectionBase } from '../../../../../types/core/chain/collection';
import idBufferToCollection from '../../utils/transformer/idBufferToCollection';
import { minimizeCollection } from '../../utils/transformer/minimizeToBase';

type ProfileCollectionResponse = { checkpoint: number; version: number; data: CollectionBase[] };

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const { offset, limit, version } = req.query as Record<string, string>;

    validateAddress(address);
    const account = await invokeGetAccount(channel, address);

    const v =
      version === undefined || version === '0'
        ? account.redeemableNft.collection.length
        : Number(version);
    const o = Number(offset ?? 0) + (account.redeemableNft.collection.length - v);
    const l = limit === undefined ? account.redeemableNft.collection.length - o : Number(limit);

    const collectionAsset = await Promise.all(
      account.redeemableNft.collection.slice(o, o + l).map(
        async (item): Promise<CollectionBase> => {
          const collection = await idBufferToCollection(channel, item);
          if (!collection)
            throw new Error(
              'Collection not found while iterating account.redeemableNft.collection',
            );
          return minimizeCollection(collection);
        },
      ),
    );

    const response: ProfileCollectionResponse = {
      data: collectionAsset,
      checkpoint: o + l,
      version: v,
    };

    res.status(200).json({ data: response, meta: { ...req.params, ...req.query } });
  } catch (err: unknown) {
    res
      .status(409)
      .json({ data: (err as string).toString(), meta: { ...req.params, ...req.query } });
  }
};
