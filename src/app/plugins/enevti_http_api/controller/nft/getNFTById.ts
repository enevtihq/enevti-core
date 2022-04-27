import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { NFT } from '../../../../../types/core/chain/nft';
import { invokeGetNFT } from '../../utils/hook/redeemable_nft_module';
import idBufferToActivityNFT from '../../utils/transformer/idBufferToActivityNFT';
import nftChainToUI from '../../utils/transformer/nftChainToUI';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const nft = await invokeGetNFT(channel, id);
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
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
