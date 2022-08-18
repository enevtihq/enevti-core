import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { LikeAt } from '../../../../../types/core/chain/engagement';
import { ResponseVersioned } from '../../../../../types/core/service/api';
import { invokeGetCommentLike } from '../../utils/hook/redeemable_nft_module';
import createPagination from '../../utils/misc/createPagination';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { offset, limit, version } = req.query as Record<string, string>;

    const commentLike = await invokeGetCommentLike(channel, id);

    const { v, o, c } = createPagination(commentLike.address.length, version, offset, limit);

    const response: ResponseVersioned<LikeAt> = {
      version: v,
      checkpoint: c,
      data: { address: commentLike.address.slice(o, c).map(t => t.toString('hex')) },
    };

    res.status(200).json({ data: response, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
