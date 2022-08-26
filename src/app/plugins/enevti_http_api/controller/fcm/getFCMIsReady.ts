import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { invokeFCMIsReady } from '../../utils/hook/fcm';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const isFCMReady = await invokeFCMIsReady(channel);

    res.status(200).json({ data: isFCMReady, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
