import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import {
  invokeGetCommentReply,
  invokeGetLiked,
  invokeGetReply,
} from '../../utils/hook/redeemable_nft_module';
import { Reply, ReplyAt } from '../../../../../types/core/chain/engagement';
import chainDateToUI from '../../utils/transformer/chainDateToUI';
import addressBufferToPersona from '../../utils/transformer/addressBufferToPersona';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { offset, limit, version, viewer } = req.query as Record<string, string>;

    const commentReply = await invokeGetCommentReply(channel, id);
    if (!commentReply) {
      res.status(404).json({ data: { message: 'Not Found' }, meta: req.params });
      return;
    }

    const v =
      version === undefined || version === '0' ? commentReply.reply.length : Number(version);
    const o = Number(offset ?? 0) + (commentReply.reply.length - v);
    const l = limit === undefined ? commentReply.reply.length - o : Number(limit);

    const response: ReplyAt = {
      reply: await Promise.all(
        commentReply.reply.slice(o, o + l).map(
          async (item): Promise<Reply & { liked: boolean }> => {
            const liked = viewer
              ? (await invokeGetLiked(channel, item.toString('hex'), viewer)) === 1
              : false;
            const replyAsset = await invokeGetReply(channel, item.toString('hex'));
            if (!replyAsset) throw new Error('Reply not found while iterating commentReply.reply');
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
    };

    res.status(200).json({ data: response, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
