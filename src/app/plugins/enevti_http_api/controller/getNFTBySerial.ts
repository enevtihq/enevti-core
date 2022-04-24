import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { invokeGetNFT, invokeGetNFTIdFromSerial } from '../utils/hook/redeemable_nft_module';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { serial } = req.params;
    const id = await invokeGetNFTIdFromSerial(channel, serial);
    if (!id) {
      res.status(404).json('Not Found');
      return;
    }
    const nft = await invokeGetNFT(channel, id.toString('hex'));

    res.status(200).json({ data: nft, meta: {} });
  } catch (err: unknown) {
    res.status(409).json(err);
  }
};
