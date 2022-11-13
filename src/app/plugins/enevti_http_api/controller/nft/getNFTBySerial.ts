import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { NFT } from '../../../../../types/core/chain/nft';
import { NFTActivity } from '../../../../../types/core/chain/nft/NFTActivity';
import { NFT_ACTIVITY_INITIAL_LENGTH } from '../../constant/limit';
import {
  invokeGetLiked,
  invokeGetNFT,
  invokeGetNFTIdFromSerial,
} from '../../utils/invoker/redeemable_nft_module';
import idBufferToActivityNFT from '../../utils/transformer/idBufferToActivityNFT';
import nftChainToUI from '../../utils/transformer/nftChainToUI';
import { isNumeric } from '../../utils/validation/number';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { serial } = req.params;
    const { activity, viewer } = req.query as Record<string, string>;
    const id = await invokeGetNFTIdFromSerial(channel, decodeURIComponent(serial));
    if (!id) {
      res.status(404).json({ data: { message: 'Not Found' }, version: {}, meta: req.params });
      return;
    }
    const nft = await invokeGetNFT(channel, id.toString('hex'));
    if (!nft) {
      res.status(404).json({ data: { message: 'Not Found' }, version: {}, meta: req.params });
      return;
    }

    const restNFT = await nftChainToUI(channel, nft);
    const liked = viewer
      ? (await invokeGetLiked(channel, nft.id.toString('hex'), viewer)) === 1
      : false;

    let activityVersion = 0;
    let activityData: NFTActivity[] = [];
    if (activity && isNumeric(activity)) {
      const collectionActivity = await idBufferToActivityNFT(channel, id);
      activityData = collectionActivity.slice(
        0,
        activity === '0' ? NFT_ACTIVITY_INITIAL_LENGTH : parseInt(activity, 10),
      );
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
    res.status(409).json({ data: (err as string).toString(), version: {}, meta: req.params });
  }
};
