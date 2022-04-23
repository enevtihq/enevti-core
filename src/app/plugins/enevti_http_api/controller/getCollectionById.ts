import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { CollectionAsset } from '../../../../types/core/chain/collection';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const collection = await channel.invoke<CollectionAsset | undefined>(
      'redeemableNft:getCollection',
      { id },
    );

    res.status(200).json({ data: collection, meta: {} });
  } catch (err: unknown) {
    res.status(409).json(err);
  }
};
