import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { Moment } from 'enevti-types/chain/moment';
import { invokeGetLiked } from '../../utils/invoker/redeemable_nft_module';
import idBufferToMoment from '../../utils/transformer/idBufferToMoment';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { viewer } = req.query as Record<string, string>;
    const moment = await idBufferToMoment(channel, Buffer.from(id, 'hex'));
    if (!moment) {
      res.status(404).json({ data: { message: 'Not Found' }, meta: req.params });
      return;
    }

    const liked = viewer ? (await invokeGetLiked(channel, id, viewer)) === 1 : false;
    const response: Moment & { liked: boolean } = {
      ...moment,
      liked,
    };

    res.status(200).json({ data: response, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
