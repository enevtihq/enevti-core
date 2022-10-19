import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { invokeSetEnevtiUserMeta } from '../../../enevti_user_meta/utils/invoker';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { publicKey, meta, signature } = req.body as Record<string, string>;
    await invokeSetEnevtiUserMeta(channel, publicKey, meta, signature);

    res.status(200).json({ data: 'success', meta: req.body as Record<string, string> });
  } catch (err: unknown) {
    res.status(409).json({
      data: (err as string).toString(),
      meta: req.body as Record<string, string>,
    });
  }
};
