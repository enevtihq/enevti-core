import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { invokeGetRegistrar } from '../../utils/invoker/registrar';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { serial } = req.params;
    const serialRegistrar = await invokeGetRegistrar(channel, 'serial', decodeURIComponent(serial));
    const isSerialExists = !!serialRegistrar;

    res.status(200).json({ data: isSerialExists, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
