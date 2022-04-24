import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { NFT } from '../../../../types/core/chain/nft';
import { invokeGetAllNFT } from '../utils/hook/redeemable_nft_module';
import idBufferToActivityNFT from '../utils/idBufferToActivityNFT';
import nftChainToUI from '../utils/nftChainToUI';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { offset, limit } = req.params;
    const nfts = await invokeGetAllNFT(channel, parseInt(offset, 10), parseInt(limit, 10));

    const response: NFT[] = await Promise.all(
      nfts.map(
        async (item): Promise<NFT> => {
          const activity = await idBufferToActivityNFT(channel, item.id);
          const restNFT = await nftChainToUI(channel, item);
          return {
            ...item,
            ...restNFT,
            activity,
          };
        },
      ),
    );

    res.status(200).json({ data: response, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: err, meta: req.params });
  }
};
