import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';

import createPagination from '../../utils/misc/createPagination';
import { MomentBase } from 'enevti-types/chain/moment';
import { idBufferToMomentAt } from '../../utils/transformer/idBufferToMomentAt';
import { minimizeMoment } from '../../utils/transformer/minimizeToBase';

type CollectionMomentResponse = { checkpoint: number; version: number; data: MomentBase[] };

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { offset, limit, version, viewer } = req.query as Record<string, string>;
    const momentAtCollection = await idBufferToMomentAt(channel, Buffer.from(id, 'hex'), viewer);
    const momentBaseAtCollection = momentAtCollection.map(moment => minimizeMoment(moment));

    const { v, o, c } = createPagination(momentBaseAtCollection.length, version, offset, limit);
    const momentBaseAtCollectionData = momentBaseAtCollection.slice(o, c);

    const response: CollectionMomentResponse = {
      data: momentBaseAtCollectionData,
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
