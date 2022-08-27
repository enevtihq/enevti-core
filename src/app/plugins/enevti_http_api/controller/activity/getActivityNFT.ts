import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { invokeGetActivityNFT } from '../../utils/invoker/redeemable_nft_module';
import createPagination from '../../utils/misc/createPagination';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { offset, limit, version } = req.query as Record<string, string>;

    const activityNFT = await invokeGetActivityNFT(channel, id);

    const { v, o, c } = createPagination(activityNFT.items.length, version, offset, limit);

    const response = {
      checkpoint: c,
      version: v,
      data: activityNFT.items.slice(o, c).map(item => ({
        date: item.date,
        name: item.name,
        to: item.to.toString('hex'),
        transaction: item.transaction.toString('hex'),
        value: {
          amount: item.value.amount.toString(),
          currency: item.value.currency,
        },
      })),
    };

    res.status(200).json({ data: response, meta: { ...req.params, ...req.query } });
  } catch (err: unknown) {
    res
      .status(409)
      .json({ data: (err as string).toString(), meta: { ...req.params, ...req.query } });
  }
};
