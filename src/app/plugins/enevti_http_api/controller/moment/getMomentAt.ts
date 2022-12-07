import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { Moment } from '../../../../../types/core/chain/moment';
import { invokeGetLiked } from '../../utils/invoker/redeemable_nft_module';
import { idBufferToMomentAt } from '../../utils/transformer/idBufferToMomentAt';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { viewer } = req.query as Record<string, string>;
    const momentAt = await idBufferToMomentAt(channel, Buffer.from(id, 'hex'));

    const response: (Moment & { liked: boolean })[] = await Promise.all(
      momentAt.map(
        async (item): Promise<Moment & { liked: boolean }> => {
          const liked = viewer ? (await invokeGetLiked(channel, item.id, viewer)) === 1 : false;
          return {
            ...item,
            liked,
          };
        },
      ),
    );

    res.status(200).json({ data: response, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
