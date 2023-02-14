import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';

import { SocialRaffleGenesisConfig } from 'enevti-types/chain/config/SocialRaffleGenesisConfig';
import { invokeGetSocialRaffleConfig } from '../../utils/invoker/redeemable_nft_module';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const ret: SocialRaffleGenesisConfig['socialRaffle'] = await invokeGetSocialRaffleConfig(
      channel,
    );

    res.status(200).json({ data: ret, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
