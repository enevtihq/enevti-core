import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { ProfileActivity } from '../../../../../types/core/account/profile';
import idBufferToActivityProfile from '../../utils/transformer/idBufferToActivityProfile';

type ProfileActivityResponse = {
  checkpoint: number;
  version: number;
  data: ProfileActivity[];
};

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const { offset, limit, version } = req.query as Record<string, string>;

    const profileActivity = await idBufferToActivityProfile(channel, Buffer.from(address, 'hex'));

    const v = version === undefined || version === '0' ? profileActivity.length : Number(version);
    const o = Number(offset ?? 0) + (profileActivity.length - v);
    const l = limit === undefined ? profileActivity.length - o : Number(limit);

    const ret: ProfileActivity[] = profileActivity.slice(o, o + l);

    const response: ProfileActivityResponse = {
      data: ret,
      checkpoint: o + l,
      version: v,
    };

    res.status(200).json({ data: response, meta: { ...req.params, ...req.query } });
  } catch (err: unknown) {
    res
      .status(409)
      .json({ data: (err as string).toString(), meta: { ...req.params, ...req.query } });
  }
};
