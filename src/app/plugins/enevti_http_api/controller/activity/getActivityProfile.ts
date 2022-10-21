import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { apiClient } from 'lisk-sdk';
import { ProfileActivity } from '../../../../../types/core/account/profile';
import createPagination from '../../utils/misc/createPagination';
import idBufferToActivityProfile from '../../utils/transformer/idBufferToActivityProfile';

type ProfileActivityResponse = {
  checkpoint: number;
  version: number;
  data: ProfileActivity[];
};

export default (channel: BaseChannel, client: apiClient.APIClient) => async (
  req: Request,
  res: Response,
) => {
  try {
    const { address } = req.params;
    const { offset, limit, version } = req.query as Record<string, string>;

    const profileActivity = await idBufferToActivityProfile(
      channel,
      client,
      Buffer.from(address, 'hex'),
    );

    const { v, o, c } = createPagination(profileActivity.length, version, offset, limit);

    const ret: ProfileActivity[] = profileActivity.slice(o, c);

    const response: ProfileActivityResponse = {
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
