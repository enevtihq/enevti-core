import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { LikeAt } from '../../../../../types/core/chain/engagement';
import { ResponseVersioned } from '../../../../../types/core/service/api';
import { invokeGetReplyClubsLike } from '../../utils/invoker/redeemable_nft_module';
import createPagination from '../../utils/misc/createPagination';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { offset, limit, version } = req.query as Record<string, string>;

    const replyLike = await invokeGetReplyClubsLike(channel, id);

    const { v, o, c } = createPagination(replyLike.address.length, version, offset, limit);

    const response: ResponseVersioned<LikeAt> = {
      checkpoint: c,
      version: v,
      data: {
        address: replyLike.address.slice(o, c).map(t => t.toString('hex')),
      },
    };

    res.status(200).json({ data: response, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
