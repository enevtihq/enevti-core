import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import {
  invokeGetCommentReply,
  invokeGetLiked,
  invokeGetReply,
} from '../../utils/invoker/redeemable_nft_module';
import { Reply, ReplyAt } from '../../../../../types/core/chain/engagement';
import chainDateToUI from '../../utils/transformer/chainDateToUI';
import addressBufferToPersona from '../../utils/transformer/addressBufferToPersona';
import { ResponseVersioned } from '../../../../../types/core/service/api';
import createPagination from '../../utils/misc/createPagination';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { offset, limit, version, viewer } = req.query as Record<string, string>;

    const commentReply = await invokeGetCommentReply(channel, id);

    const { v, o, c } = createPagination(commentReply.reply.length, version, offset, limit);

    const response: ResponseVersioned<ReplyAt> = {
      version: v,
      checkpoint: c,
      data: {
        reply: await Promise.all(
          commentReply.reply.slice(o, c).map(
            async (item): Promise<Reply & { liked: boolean }> => {
              const liked = viewer
                ? (await invokeGetLiked(channel, item.toString('hex'), viewer)) === 1
                : false;
              const replyAsset = await invokeGetReply(channel, item.toString('hex'));
              if (!replyAsset)
                throw new Error('Reply not found while iterating commentReply.reply');
              return {
                ...replyAsset,
                id: replyAsset.id.toString('hex'),
                date: chainDateToUI(replyAsset.date),
                owner: await addressBufferToPersona(channel, replyAsset.owner),
                target: replyAsset.target.toString('hex'),
                liked,
              };
            },
          ),
        ),
      },
    };

    res.status(200).json({ data: response, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
