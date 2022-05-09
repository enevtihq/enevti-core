import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { invokeGetActivityCollection } from '../../utils/hook/redeemable_nft_module';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const activityCollection = await invokeGetActivityCollection(channel, id);
    if (!activityCollection) {
      res.status(404).json({ data: { message: 'Not Found' }, meta: req.params });
      return;
    }

    const response = activityCollection.items.map(item => ({
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

    res.status(200).json({ data: response, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
