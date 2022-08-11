import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';

import { Profile } from '../../../../../types/core/account/profile';
import { invokeGetAccount } from '../../utils/hook/persona_module';
import { validateAddress } from '../../utils/validation/address';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    validateAddress(address);
    const account = await invokeGetAccount(channel, address);

    const profile: Profile = {
      balance: account.token.balance.toString(),
      stake: account.dpos.delegate.totalVotesReceived.toString(),
      social: { twitter: { link: account.persona.social.twitter, stat: 0 } },
      nftSold: account.redeemableNft.nftSold,
      treasuryAct: account.redeemableNft.treasuryAct,
      serveRate: account.redeemableNft.serveRate,
      owned: [],
      onSale: [],
      collection: [],
      pending: account.redeemableNft.pending.length,
      raffled: account.redeemableNft.raffled,
    };

    res.status(200).json({ data: profile, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
