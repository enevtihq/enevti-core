import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { Collection, CollectionActivity } from '../../../../../types/core/chain/collection';
import idBufferToActivityCollection from '../../utils/transformer/idBufferToActivityCollection';

type CollectionActivityResponse = {
  checkpoint: number;
  version: number;
  data: Collection['activity'];
};

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { offset, limit, version } = req.query as Record<string, string>;

    const collectionActivity = await idBufferToActivityCollection(channel, Buffer.from(id, 'hex'));

    const v =
      version === undefined || version === '0' ? collectionActivity.length : Number(version);
    const o = Number(offset ?? 0) + (collectionActivity.length - v);
    const l = limit === undefined ? collectionActivity.length - o : Number(limit);

    const ret: CollectionActivity[] = collectionActivity.slice(o, o + l);

    const response: CollectionActivityResponse = {
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
