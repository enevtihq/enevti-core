import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { invokeGetMoment } from '../../utils/invoker/redeemable_nft_module';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { address } = req.query as Record<string, string>;

    const moment = await invokeGetMoment(channel, id);
    if (!moment) {
      throw new Error('Moment not found');
    }

    let isOwnerOrCreator = true;

    if (
      Buffer.compare(moment.creator, Buffer.from(address, 'hex')) !== 0 &&
      Buffer.compare(moment.owner, Buffer.from(address, 'hex')) !== 0
    ) {
      isOwnerOrCreator = false;
    }

    res.status(200).json({ data: isOwnerOrCreator, meta: req.query });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.query });
  }
};
