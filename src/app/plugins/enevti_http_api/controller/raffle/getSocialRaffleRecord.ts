import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';

import { SocialRaffleRecord } from '../../../../../types/core/chain/socialRaffle';
import { invokeGetSocialRaffleRecord } from '../../utils/invoker/redeemable_nft_module';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { height } = req.params;
    const ret: SocialRaffleRecord = await invokeGetSocialRaffleRecord(channel, Number(height));

    res.status(200).json({ data: ret, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
