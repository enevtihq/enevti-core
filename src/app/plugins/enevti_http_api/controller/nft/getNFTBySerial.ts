import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { NFT } from '../../../../../types/core/chain/nft';
import {
  invokeGetLiked,
  invokeGetNFT,
  invokeGetNFTIdFromSerial,
} from '../../utils/invoker/redeemable_nft_module';
import nftChainToUI from '../../utils/transformer/nftChainToUI';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { serial } = req.params;
    const { viewer } = req.query as Record<string, string>;
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

    const restNFT = await nftChainToUI(channel, nft);
    const liked = viewer
      ? (await invokeGetLiked(channel, nft.id.toString('hex'), viewer)) === 1
      : false;
    const response: NFT & { liked: boolean } = {
      ...nft,
      ...restNFT,
      activity: [],
      liked,
    };

    res.status(200).json({ data: response, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
