import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { invokeGetAccount } from '../../utils/invoker/persona_module';
import { validateAddress } from '../../utils/validation/address';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    validateAddress(address);
    const account = await invokeGetAccount(channel, address);

    res.status(200).json({ data: account.sequence.nonce.toString(), meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
