import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { invokeGetAllNFTTemplate } from '../../utils/hook/redeemable_nft_module';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { offset, limit } = req.params;
    const template = await invokeGetAllNFTTemplate(
      channel,
      parseInt(offset, 10),
      parseInt(limit, 10),
    );

    res.status(200).json({ data: template, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: err, meta: req.params });
  }
};
