import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { MomentBase } from 'enevti-types/chain/moment';
import { NFT } from 'enevti-types/chain/nft';
import { NFTActivity } from 'enevti-types/chain/nft/NFTActivity';
import { NFT_ACTIVITY_INITIAL_LENGTH, NFT_MOMENT_INITIAL_LENGTH } from '../../constant/limit';
import { invokeGetLiked, invokeGetNFT } from '../../utils/invoker/redeemable_nft_module';
import idBufferToActivityNFT from '../../utils/transformer/idBufferToActivityNFT';
import { idBufferToMomentAt } from '../../utils/transformer/idBufferToMomentAt';
import nftChainToUI from '../../utils/transformer/nftChainToUI';
import { isNumeric } from '../../utils/validation/number';
import { invokeGetRegistrar } from '../../utils/invoker/registrar';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { serial } = req.params;
    const { activity, moment, viewer } = req.query as Record<string, string>;
    const serialRegistrar = await invokeGetRegistrar(channel, 'serial', decodeURIComponent(serial));
    if (!serialRegistrar) {
      res.status(404).json({ data: { message: 'Not Found' }, version: {}, meta: req.params });
      return;
    }
    const nft = await invokeGetNFT(channel, serialRegistrar.id.toString('hex'));
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
      const collectionActivity = await idBufferToActivityNFT(channel, serialRegistrar.id);
      activityData = collectionActivity.slice(
        0,
        activity === '0' ? NFT_ACTIVITY_INITIAL_LENGTH : parseInt(activity, 10),
      );
      activityVersion = collectionActivity.length;
    }

    let momentVersion = 0;
    let momentData: MomentBase[] = [];
    if (moment && isNumeric(moment)) {
      const nftMoments = await idBufferToMomentAt(channel, serialRegistrar.id, viewer);
      momentData = nftMoments.slice(
        0,
        moment === '0' ? NFT_MOMENT_INITIAL_LENGTH : parseInt(moment, 10),
      );
      momentVersion = nftMoments.length;
    }

    const response: NFT & { liked: boolean } = {
      ...nft,
      ...restNFT,
      activity: activityData,
      moment: momentData,
      liked,
    };

    const version = {
      activity: activityVersion,
      moment: momentVersion,
    };

    res.status(200).json({ data: response, version, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), version: {}, meta: req.params });
  }
};
