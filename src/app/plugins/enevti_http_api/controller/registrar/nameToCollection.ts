import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { invokeGetRegistrar } from '../../utils/invoker/registrar';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const nameRegistrar = await invokeGetRegistrar(channel, 'name', name);
    if (!nameRegistrar) {
      res.status(404).json({ data: { message: 'Not Found' }, meta: req.params });
      return;
    }

    res.status(200).json({ data: nameRegistrar.id.toString('hex'), meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
