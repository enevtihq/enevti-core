import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { invokeGetRegistrar } from '../../utils/invoker/registrar';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const nameRegistrar = await invokeGetRegistrar(channel, 'name', name);
    const isNameExists = !!nameRegistrar;

    res.status(200).json({ data: isNameExists, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
