import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { Collection } from '../../../../../types/core/chain/collection';
import { invokeGetCollection } from '../../utils/hook/redeemable_nft_module';
import { NFT } from '../../../../../types/core/chain/nft';
import idBufferToNFT from '../../utils/transformer/idBufferToNFT';

type CollectionMintedResponse = { checkpoint: number; version: number; data: Collection['minted'] };

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { offset, limit, version } = req.query as Record<string, string>;

    const collection = await invokeGetCollection(channel, id);
    if (!collection) {
      res.status(404).json({ data: { message: 'Not Found' }, meta: req.params });
      return;
    }

    const v = version === undefined || version === '0' ? collection.minted.length : Number(version);
    const o = Number(offset ?? 0) + (collection.minted.length - v);
    const l = limit === undefined ? collection.minted.length - o : Number(limit);

    const minted = await Promise.all(
      collection.minted.slice(o, o + l).map(
        async (item): Promise<NFT> => {
          const nft = await idBufferToNFT(channel, item);
          if (!nft) throw new Error('NFT not found while iterating collection.minted');
          return nft;
        },
      ),
    );

    const response: CollectionMintedResponse = {
      data: minted,
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
