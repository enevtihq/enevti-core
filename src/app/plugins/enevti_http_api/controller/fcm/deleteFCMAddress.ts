import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { invokeFCMRemoveAddress } from '../../utils/hook/fcm';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { address } = req.body as Record<string, string>;
    await invokeFCMRemoveAddress(channel, address);

    res.status(200).json({ data: 'success', meta: req.body as Record<string, string> });
  } catch (err: unknown) {
    res.status(409).json({
      data: (err as string).toString(),
      meta: req.body as Record<string, string>,
    });
  }
};
