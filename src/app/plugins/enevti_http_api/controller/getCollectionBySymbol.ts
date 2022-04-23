import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { CollectionAsset } from '../../../../types/core/chain/collection';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;

    const id = await channel.invoke<Buffer | undefined>('redeemableNft:getCollectionIdFromSymbol', {
      symbol,
    });

    const collection = await channel.invoke<CollectionAsset | undefined>(
      'redeemableNft:getCollection',
      { id },
    );

    res.status(200).json({ data: collection, meta: {} });
  } catch (err: unknown) {
    res.status(409).json(err);
  }
};
