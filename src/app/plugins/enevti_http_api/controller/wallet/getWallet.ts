import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';

import { WalletView } from '../../../../../types/core/service/wallet';
import { invokeGetAccount } from '../../utils/hook/persona_module';
import { validateAddress } from '../../utils/validation/address';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    validateAddress(address);
    const account = await invokeGetAccount(channel, address);

    const staked = account.dpos.sentVotes.reduce(
      (prev, current) => prev + current.amount,
      BigInt(0),
    );

    const wallet: Omit<WalletView, 'version' | 'fetchedVersion'> = {
      balance: account.token.balance.toString(),
      staked: staked.toString(),
      history: [],
    };

    res.status(200).json({ data: wallet, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
