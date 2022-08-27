import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { invokeIsNameExists } from '../../utils/invoker/redeemable_nft_module';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const isNameExists = await invokeIsNameExists(channel, name);

    res.status(200).json({ data: isNameExists, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
