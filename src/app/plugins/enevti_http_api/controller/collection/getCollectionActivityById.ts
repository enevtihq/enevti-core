import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { Collection, CollectionActivity } from 'enevti-types/chain/collection';
import createPagination from '../../utils/misc/createPagination';
import idBufferToActivityCollection from '../../utils/transformer/idBufferToActivityCollection';

type CollectionActivityResponse = {
  checkpoint: number;
  version: number;
  data: Collection['activity'];
};

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { offset, limit, version, viewer } = req.query as Record<string, string>;

    const collectionActivity = await idBufferToActivityCollection(
      channel,
      Buffer.from(id, 'hex'),
      viewer,
    );

    const { v, o, c } = createPagination(collectionActivity.length, version, offset, limit);

    const ret: CollectionActivity[] = collectionActivity.slice(o, c);

    const response: CollectionActivityResponse = {
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
