import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { Collection } from 'enevti-types/chain/collection';
import { invokeGetCollection } from '../../utils/invoker/redeemable_nft_module';
import { NFTBase } from 'enevti-types/chain/nft';
import idBufferToNFT from '../../utils/transformer/idBufferToNFT';
import createPagination from '../../utils/misc/createPagination';
import { minimizeNFT } from '../../utils/transformer/minimizeToBase';

type CollectionMintedResponse = { checkpoint: number; version: number; data: Collection['minted'] };

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { offset, limit, version, viewer } = req.query as Record<string, string>;

    const collection = await invokeGetCollection(channel, id);
    if (!collection) {
      res.status(404).json({ data: { message: 'Not Found' }, meta: req.params });
      return;
    }

    const { v, o, c } = createPagination(collection.minted.length, version, offset, limit);

    const minted = await Promise.all(
      collection.minted.slice(o, c).map(
        async (item): Promise<NFTBase> => {
          const nft = await idBufferToNFT(channel, item, false, viewer);
          if (!nft) throw new Error('NFT not found while iterating collection.minted');
          return minimizeNFT(nft);
        },
      ),
    );

    const response: CollectionMintedResponse = {
      data: minted,
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
