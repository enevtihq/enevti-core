import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { invokeIsUsernameExists } from '../utils/hook/persona_module';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const isUsernameExists = await invokeIsUsernameExists(channel, username);

    res.status(200).json({ data: isUsernameExists, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: err, meta: req.params });
  }
};
