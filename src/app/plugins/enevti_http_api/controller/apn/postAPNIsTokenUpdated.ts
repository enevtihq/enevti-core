import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { invokeAPNIsTokenUpdated } from '../../../apple_push_notification_service/utils/invoker';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { address, token } = req.body as Record<string, string>;
    const result = await invokeAPNIsTokenUpdated(channel, address, token);

    res.status(200).json({ data: result, meta: req.body as Record<string, string> });
  } catch (err: unknown) {
    res.status(409).json({
      data: (err as string).toString(),
      meta: req.body as Record<string, string>,
    });
  }
};
