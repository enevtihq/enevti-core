import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { NFT } from '../../../../../types/core/chain/nft';
import {
  invokeGetNFT,
  invokeGetNFTIdFromSerial,
  invokeGetNFTLike,
} from '../../utils/hook/redeemable_nft_module';
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
    let liked = false;
    if (viewer) {
      const likeNFTAsset = await invokeGetNFTLike(channel, nft.id.toString('hex'));
      if (likeNFTAsset) {
        liked =
          likeNFTAsset.address.findIndex(
            t => Buffer.compare(Buffer.from(viewer, 'hex'), t) === 0,
          ) !== -1;
      }
    }
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
