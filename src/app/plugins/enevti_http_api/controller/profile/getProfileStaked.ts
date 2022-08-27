import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { WalletStaked } from '../../../../../types/core/service/wallet';

import { invokeGetAccount } from '../../utils/invoker/persona_module';
import addressBufferToPersona from '../../utils/transformer/addressBufferToPersona';
import { validateAddress } from '../../utils/validation/address';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    validateAddress(address);
    const account = await invokeGetAccount(channel, address);

    const staked: WalletStaked[] = await Promise.all(
      account.dpos.sentVotes.map(async item => ({
        persona: await addressBufferToPersona(channel, item.delegateAddress),
        amount: item.amount.toString(),
      })),
    );

    res.status(200).json({ data: staked, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
