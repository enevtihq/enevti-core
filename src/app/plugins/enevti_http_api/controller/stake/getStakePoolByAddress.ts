import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { StakePoolData } from '../../../../../types/core/chain/stake';
import addressBufferToPersona from '../../utils/transformer/addressBufferToPersona';
import { invokeGetStakerByAddress } from '../../utils/invoker/creator_finance_module.ts';
import { validateAddress } from '../../utils/validation/address';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    validateAddress(address);
    const stakerChain = await invokeGetStakerByAddress(channel, address);
    if (!stakerChain) {
      res.status(404).json({ data: { message: 'Not Found' }, meta: req.params });
      return;
    }

    const stake: StakePoolData = {
      owner: await addressBufferToPersona(channel, Buffer.from(address, 'hex')),
      staker: [],
    };

    res.status(200).json({ data: stake, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
