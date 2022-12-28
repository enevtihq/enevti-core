import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';

import createPagination from '../../utils/misc/createPagination';
import { MomentBase } from '../../../../../types/core/chain/moment';
import { idBufferToMomentAt } from '../../utils/transformer/idBufferToMomentAt';
import { minimizeMoment } from '../../utils/transformer/minimizeToBase';

type NFTMomentResponse = { checkpoint: number; version: number; data: MomentBase[] };

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { offset, limit, version, viewer } = req.query as Record<string, string>;
    const momentAtNFT = await idBufferToMomentAt(channel, Buffer.from(id, 'hex'), viewer);
    const momentBaseAtNFT = momentAtNFT.map(moment => minimizeMoment(moment));

    const { v, o, c } = createPagination(momentBaseAtNFT.length, version, offset, limit);
    const momentBaseAtNFTData = momentBaseAtNFT.slice(o, c);

    const response: NFTMomentResponse = {
      data: momentBaseAtNFTData,
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
