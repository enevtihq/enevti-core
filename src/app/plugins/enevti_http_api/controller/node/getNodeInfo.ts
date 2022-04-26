import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { invokeGetNodeIndo } from '../../utils/hook/app';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const nodeInfo = await invokeGetNodeIndo(channel);

    res.status(200).json({ data: nodeInfo, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: err, meta: req.params });
  }
};
