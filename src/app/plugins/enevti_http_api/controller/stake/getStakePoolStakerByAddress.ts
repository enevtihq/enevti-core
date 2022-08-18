import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { StakerItem } from '../../../../../types/core/chain/stake';
import addressBufferToPersona from '../../utils/transformer/addressBufferToPersona';
import { invokeGetStakerByAddress } from '../../utils/hook/creator_finance_module.ts';
import { validateAddress } from '../../utils/validation/address';
import createPagination from '../../utils/misc/createPagination';

type StakerResponse = { checkpoint: number; version: number; data: StakerItem[] };

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const { offset, limit, version } = req.query as Record<string, string>;

    validateAddress(address);
    const stakerChain = await invokeGetStakerByAddress(channel, address);
    if (!stakerChain) {
      res.status(404).json({ data: { message: 'Not Found' }, meta: req.params });
      return;
    }

    const { v, o, c } = createPagination(stakerChain.items.length, version, offset, limit);

    const staker = await Promise.all(
      stakerChain.items.slice(o, c).map(
        async (item): Promise<StakerItem> => {
          const persona = await addressBufferToPersona(channel, item.persona);
          return {
            ...item,
            id: item.id.toString('hex'),
            persona,
            stake: item.stake.toString(),
          };
        },
      ),
    );

    const response: StakerResponse = {
      data: staker,
      version: v,
      checkpoint: c,
    };

    res.status(200).json({ data: response, meta: { ...req.params, ...req.query } });
  } catch (err: unknown) {
    res
      .status(409)
      .json({ data: (err as string).toString(), meta: { ...req.params, ...req.query } });
  }
};
