import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { MomentBase } from '../../../../../types/core/chain/moment';
import { invokeGetAllMoment, invokeGetLiked } from '../../utils/invoker/redeemable_nft_module';
import createPagination from '../../utils/misc/createPagination';
import idBufferToMoment from '../../utils/transformer/idBufferToMoment';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { offset, limit, version, viewer } = req.query as Record<string, string>;
    const moments = await invokeGetAllMoment(channel);
    const { v, o, c } = createPagination(moments.data.length, version, offset, limit);

    const momentList: MomentBase[] = await Promise.all(
      moments.data.slice(o, c).map(
        async (item): Promise<MomentBase> => {
          const data = await idBufferToMoment(channel, item.id);
          if (!data) throw new Error('Error while iterating allMoments.data');
          const liked = viewer
            ? (await invokeGetLiked(channel, item.id.toString('hex'), viewer)) === 1
            : false;
          return {
            ...data,
            liked,
          };
        },
      ),
    );

    const response = {
      checkpoint: c,
      version: v,
      data: momentList,
    };

    res.status(200).json({ data: response, meta: req.query });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.query });
  }
};
