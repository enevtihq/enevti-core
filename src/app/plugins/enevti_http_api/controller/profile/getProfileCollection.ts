import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';

import { invokeGetAccount } from '../../utils/invoker/persona_module';
import { validateAddress } from '../../utils/validation/address';
import { CollectionBase } from '../../../../../types/core/chain/collection';
import idBufferToCollection from '../../utils/transformer/idBufferToCollection';
import { minimizeCollection } from '../../utils/transformer/minimizeToBase';
import createPagination from '../../utils/misc/createPagination';

type ProfileCollectionResponse = { checkpoint: number; version: number; data: CollectionBase[] };

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const { offset, limit, version } = req.query as Record<string, string>;

    validateAddress(address);
    const account = await invokeGetAccount(channel, address);

    const { v, o, c } = createPagination(
      account.redeemableNft.collection.length,
      version,
      offset,
      limit,
    );

    const collectionAsset = await Promise.all(
      account.redeemableNft.collection.slice(o, c).map(
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
      checkpoint: c,
      version: v,
    };

    res.status(200).json({ data: response, meta: { ...req.params, ...req.query } });
  } catch (err: unknown) {
    res
      .status(409)
      .json({ data: (err as string).toString(), meta: { ...req.params, ...req.query } });
  }
};
