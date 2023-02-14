import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { Moment } from 'enevti-types/chain/moment';
import createPagination from '../../utils/misc/createPagination';
import { idBufferToMomentAt } from '../../utils/transformer/idBufferToMomentAt';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { offset, limit, version, viewer } = req.query as Record<string, string>;
    const momentAt = await idBufferToMomentAt(channel, Buffer.from(id, 'hex'), viewer);

    const { v, o, c } = createPagination(momentAt.length, version, offset, limit);

    const moment: Moment[] = momentAt.slice(o, c);

    const response = {
      data: moment,
      version: v,
      checkpoint: c,
    };

    res.status(200).json({ data: response, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
