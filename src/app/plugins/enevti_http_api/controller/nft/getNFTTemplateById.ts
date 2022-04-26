import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { invokeGetNFTTemplateById } from '../../utils/hook/redeemable_nft_module';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const template = await invokeGetNFTTemplateById(channel, id);
    if (!template) {
      res.status(404).json({ data: { message: 'Not Found' }, meta: req.params });
      return;
    }

    res.status(200).json({ data: template, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: err, meta: req.params });
  }
};
