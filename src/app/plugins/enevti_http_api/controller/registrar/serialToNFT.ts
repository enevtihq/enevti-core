import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { invokeGetNFTIdFromSerial } from '../../utils/hook/redeemable_nft_module';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { serial } = req.params;
    const nftId = await invokeGetNFTIdFromSerial(channel, serial);
    if (!nftId) {
      res.status(404).json({ data: { message: 'Not Found' }, meta: req.params });
      return;
    }

    res.status(200).json({ data: nftId.toString('hex'), meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
