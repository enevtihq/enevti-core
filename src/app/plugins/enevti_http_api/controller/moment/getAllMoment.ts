import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { Moment } from '../../../../../types/core/chain/moment';
import { invokeGetIPFSTextCache } from '../../../ipfs_text_cache/utils/invoker';
import { invokeGetAllMoment, invokeGetLiked } from '../../utils/invoker/redeemable_nft_module';
import idBufferToMoment from '../../utils/transformer/idBufferToMoment';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { offset, limit, version, viewer } = req.query as Record<string, string>;
    const moments = await invokeGetAllMoment(
      channel,
      offset ? parseInt(offset, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
      version ? parseInt(version, 10) : undefined,
    );

    const response: (Moment & { liked: boolean })[] = await Promise.all(
      moments.data.map(
        async (item): Promise<Moment & { liked: boolean }> => {
          const liked = viewer
            ? (await invokeGetLiked(channel, item.id.toString('hex'), viewer)) === 1
            : false;
          const data = await idBufferToMoment(channel, item.id);
          if (!data) throw new Error('Error while iterating allMoments.data');
          return {
            ...data,
            liked,
            textPlain: await invokeGetIPFSTextCache(channel, item.text),
          };
        },
      ),
    );

    res.status(200).json({ data: response, meta: req.query });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.query });
  }
};
