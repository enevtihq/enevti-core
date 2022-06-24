import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';

import { WalletView } from '../../../../../types/core/service/wallet';
import { invokeGetAccount } from '../../utils/hook/persona_module';
import addressBufferToPersona from '../../utils/transformer/addressBufferToPersona';
import { validateAddress } from '../../utils/validation/address';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    validateAddress(address);
    const account = await invokeGetAccount(channel, address);

    const staked: WalletView['staked'] = await Promise.all(
      account.dpos.sentVotes.map(async item => ({
        persona: await addressBufferToPersona(channel, item.delegateAddress),
        amount: item.amount.toString(),
      })),
    );

    const wallet: WalletView = {
      balance: account.token.balance.toString(),
      staked,
      history: [],
    };

    res.status(200).json({ data: wallet, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
