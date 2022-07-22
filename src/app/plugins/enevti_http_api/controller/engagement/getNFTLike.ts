import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { invokeGetNFTLike } from '../../utils/hook/redeemable_nft_module';
import { LikeAt } from '../../../../../types/core/chain/engagement';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { offset, limit, version } = req.query as Record<string, string>;

    const nftLike = await invokeGetNFTLike(channel, id);
    if (!nftLike) {
      res.status(404).json({ data: { message: 'Not Found' }, meta: req.params });
      return;
    }

    const v = version === undefined || version === '0' ? nftLike.address.length : Number(version);
    const o = Number(offset ?? 0) + (nftLike.address.length - v);
    const l = limit === undefined ? nftLike.address.length - o : Number(limit);

    const response: LikeAt = {
      address: nftLike.address.slice(o, o + l).map(t => t.toString('hex')),
    };

    res.status(200).json({ data: response, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
