import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { invokeGetActivityCollection } from '../../utils/hook/redeemable_nft_module';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { offset, limit, version } = req.query as Record<string, string>;

    const activityCollection = await invokeGetActivityCollection(channel, id);
    if (!activityCollection) {
      res.status(404).json({ data: { message: 'Not Found' }, meta: req.params });
      return;
    }

    const v =
      version === undefined || version === '0' ? activityCollection.items.length : Number(version);
    const o = Number(offset ?? 0) + (activityCollection.items.length - v);
    const l = limit === undefined ? activityCollection.items.length - o : Number(limit);

    const response = activityCollection.items.slice(o, o + l).map(item => ({
      date: item.date,
      name: item.name,
      nfts: item.nfts.map(t => t.toString('hex')),
      to: item.to.toString('hex'),
      transaction: item.transaction.toString('hex'),
      value: {
        amount: item.value.amount.toString(),
        currency: item.value.currency,
      },
    }));

    res.status(200).json({ data: response, meta: { ...req.params, ...req.query } });
  } catch (err: unknown) {
    res
      .status(409)
      .json({ data: (err as string).toString(), meta: { ...req.params, ...req.query } });
  }
};
