import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { LikeAt } from '../../../../../types/core/chain/engagement';
import { ResponseVersioned } from '../../../../../types/core/service/api';
import { invokeGetCollectionLike } from '../../utils/hook/redeemable_nft_module';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { offset, limit, version } = req.query as Record<string, string>;

    const collectionLike = await invokeGetCollectionLike(channel, id);

    const v =
      version === undefined || version === '0' ? collectionLike.address.length : Number(version);
    const o = Number(offset ?? 0) + (collectionLike.address.length - v);
    const l = limit === undefined ? collectionLike.address.length - o : Number(limit);

    const response: ResponseVersioned<LikeAt> = {
      version: v,
      checkpoint: o + l,
      data: { address: collectionLike.address.slice(o, o + l).map(t => t.toString('hex')) },
    };

    res.status(200).json({ data: response, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
