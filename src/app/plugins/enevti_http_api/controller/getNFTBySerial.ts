import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { NFT } from '../../../../types/core/chain/nft';
import { invokeGetNFT, invokeGetNFTIdFromSerial } from '../utils/hook/redeemable_nft_module';
import idBufferToActivityNFT from '../utils/idBufferToActivityNFT';
import nftChainToUI from '../utils/nftChainToUI';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { serial } = req.params;
    const id = await invokeGetNFTIdFromSerial(channel, serial);
    if (!id) {
      res.status(404).json({ data: { message: 'Not Found' }, meta: req.params });
      return;
    }
    const nft = await invokeGetNFT(channel, id.toString('hex'));
    if (!nft) {
      res.status(404).json({ data: { message: 'Not Found' }, meta: req.params });
      return;
    }

    const activity = await idBufferToActivityNFT(channel, nft.id);
    const restNFT = await nftChainToUI(channel, nft);
    const response: NFT = {
      ...nft,
      ...restNFT,
      activity,
    };

    res.status(200).json({ data: response, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: err, meta: req.params });
  }
};
