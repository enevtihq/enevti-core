import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { invokeGetAllNFTTemplate } from '../../utils/hook/redeemable_nft_module';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { offset, limit } = req.query as Record<string, string>;
    const template = await invokeGetAllNFTTemplate(
      channel,
      parseInt(offset, 10),
      parseInt(limit, 10),
    );

    res.status(200).json({ data: template, meta: req.query });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.query });
  }
};
