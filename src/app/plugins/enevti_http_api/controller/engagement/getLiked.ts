import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { invokeGetLiked } from '../../utils/hook/redeemable_nft_module';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { id, address } = req.params;
    const response: number = await invokeGetLiked(channel, id, address);

    res.status(200).json({ data: response, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
