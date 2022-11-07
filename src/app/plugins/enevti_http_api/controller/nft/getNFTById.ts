import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { NFT } from '../../../../../types/core/chain/nft';
import { NFTActivity } from '../../../../../types/core/chain/nft/NFTActivity';
import { NFT_ACTIVITY_INITIAL_LENGTH } from '../../constant/limit';
import { invokeGetLiked, invokeGetNFT } from '../../utils/invoker/redeemable_nft_module';
import idBufferToActivityNFT from '../../utils/transformer/idBufferToActivityNFT';
import nftChainToUI from '../../utils/transformer/nftChainToUI';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { activity, viewer } = req.query as Record<string, string>;
    const nft = await invokeGetNFT(channel, id);
    if (!nft) {
      res.status(404).json({ data: { message: 'Not Found' }, meta: req.params });
      return;
    }

    const restNFT = await nftChainToUI(channel, nft);
    const liked = viewer
      ? (await invokeGetLiked(channel, nft.id.toString('hex'), viewer)) === 1
      : false;

    let activityVersion = 0;
    let activityData: NFTActivity[] = [];
    if (activity === 'true') {
      const collectionActivity = await idBufferToActivityNFT(channel, Buffer.from(id, 'hex'));
      activityData = collectionActivity.slice(0, NFT_ACTIVITY_INITIAL_LENGTH);
      activityVersion = collectionActivity.length;
    }

    const response: NFT & { liked: boolean } = {
      ...nft,
      ...restNFT,
      activity: activityData,
      liked,
    };

    const version = {
      activity: activityVersion,
    };

    res.status(200).json({ data: response, version, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
