import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';

import { invokeGetAccount } from '../../utils/invoker/persona_module';
import { validateAddress } from '../../utils/validation/address';
import createPagination from '../../utils/misc/createPagination';
import { MomentBase } from 'enevti-types/chain/moment';
import idBufferToMoment from '../../utils/transformer/idBufferToMoment';

type ProfileCreatedMomentResponse = { checkpoint: number; version: number; data: MomentBase[] };

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const { offset, limit, version, viewer } = req.query as Record<string, string>;

    validateAddress(address);
    const account = await invokeGetAccount(channel, address);

    const { v, o, c } = createPagination(
      account.redeemableNft.momentCreated.length,
      version,
      offset,
      limit,
    );

    const momentCreatedAsset = await Promise.all(
      account.redeemableNft.momentCreated.slice(o, c).map(
        async (item): Promise<MomentBase> => {
          const moment = await idBufferToMoment(channel, item, viewer);
          if (!moment)
            throw new Error('Moment not found while iterating account.redeemableNft.momentCreated');
          return moment;
        },
      ),
    );

    const response: ProfileCreatedMomentResponse = {
      data: momentCreatedAsset,
      checkpoint: c,
      version: v,
    };

    res.status(200).json({ data: response, meta: { ...req.params, ...req.query } });
  } catch (err: unknown) {
    res
      .status(409)
      .json({ data: (err as string).toString(), meta: { ...req.params, ...req.query } });
  }
};
