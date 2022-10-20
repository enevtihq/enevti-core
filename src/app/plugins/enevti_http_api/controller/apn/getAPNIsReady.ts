import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { invokeAPNIsReady } from '../../../apple_push_notification_service/utils/invoker';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const isAPNReady = await invokeAPNIsReady(channel);

    res.status(200).json({ data: isAPNReady, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
