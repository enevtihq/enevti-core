import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { invokeGetRegistrar } from '../../utils/invoker/registrar';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const symbolRegistrar = await invokeGetRegistrar(channel, 'symbol', symbol);
    const isSymbolExists = !!symbolRegistrar;

    res.status(200).json({ data: isSymbolExists, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
