import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { invokeGetRegistrar } from '../../utils/invoker/registrar';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const usernameRegistrar = await invokeGetRegistrar(channel, 'username', username);
    const isUsernameExists = !!usernameRegistrar;

    res.status(200).json({ data: isUsernameExists, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
