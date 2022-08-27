import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { invokeFCMIsAddressRegistered } from '../../../firebase_cloud_messaging/utils/invoker';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const isAddressRegistered = await invokeFCMIsAddressRegistered(channel, address);

    res.status(200).json({ data: isAddressRegistered, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
