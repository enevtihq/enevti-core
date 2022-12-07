import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { NFT } from '../../../../../types/core/chain/nft';
import { invokeGetAllNFT, invokeGetLiked } from '../../utils/invoker/redeemable_nft_module';
import nftChainToUI from '../../utils/transformer/nftChainToUI';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { offset, limit, viewer } = req.query as Record<string, string>;
    const nfts = await invokeGetAllNFT(channel, parseInt(offset, 10), parseInt(limit, 10));

    const response: (NFT & { liked: boolean })[] = await Promise.all(
      nfts.map(
        async (item): Promise<NFT & { liked: boolean }> => {
          const restNFT = await nftChainToUI(channel, item);
          const liked = viewer
            ? (await invokeGetLiked(channel, item.id.toString('hex'), viewer)) === 1
            : false;
          return {
            ...item,
            ...restNFT,
            activity: [],
            moment: [],
            liked,
          };
        },
      ),
    );

    res.status(200).json({ data: response, meta: req.query });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.query });
  }
};
