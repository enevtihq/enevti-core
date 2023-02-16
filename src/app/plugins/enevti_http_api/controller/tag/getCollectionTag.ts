import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { Collection } from 'enevti-types/chain/collection';
import { invokeGetCollection } from '../../utils/invoker/redeemable_nft_module';
import addressBufferToPersona from '../../utils/transformer/addressBufferToPersona';
import { invokeGetRegistrar } from '../../utils/invoker/registrar';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { q } = req.query as Record<string, string>;
    const nameRegistrar = await invokeGetRegistrar(channel, 'name', q);
    if (!nameRegistrar) {
      res.status(200).json({ data: [], meta: req.query });
      return;
    }
    const collection = await invokeGetCollection(channel, nameRegistrar.id.toString('hex'));
    if (!collection) {
      res.status(200).json({ data: [], meta: req.query });
      return;
    }

    const response: {
      name: Collection['name'];
      id: Collection['id'];
      cover: Collection['cover'];
      symbol: Collection['symbol'];
      creator: Collection['creator'];
    }[] = [
      {
        name: collection.name,
        id: collection.id.toString('hex'),
        cover: collection.cover,
        symbol: collection.symbol,
        creator: await addressBufferToPersona(channel, collection.creator),
      },
    ];

    res.status(200).json({ data: response, meta: req.query });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.query });
  }
};
