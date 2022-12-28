import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { EngagementActivity } from '../../../../../types/core/account/profile';
import createPagination from '../../utils/misc/createPagination';
import idBufferToActivityEngagement from '../../utils/transformer/idBufferToActivityEngagement';

type EngagementActivityResponse = {
  checkpoint: number;
  version: number;
  data: EngagementActivity[];
};

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const { offset, limit, version, viewer } = req.query as Record<string, string>;

    const profileActivity = await idBufferToActivityEngagement(
      channel,
      Buffer.from(address, 'hex'),
      viewer,
    );

    const { v, o, c } = createPagination(profileActivity.length, version, offset, limit);

    const ret: EngagementActivity[] = profileActivity.slice(o, c);

    const response: EngagementActivityResponse = {
      data: ret,
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
