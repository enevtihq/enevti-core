import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { CommentClubs } from '../../../../../types/core/chain/engagement';
import { invokeGetCommentClubs, invokeGetLiked } from '../../utils/invoker/redeemable_nft_module';
import addressBufferToPersona from '../../utils/transformer/addressBufferToPersona';
import chainDateToUI from '../../utils/transformer/chainDateToUI';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { viewer } = req.query as Record<string, string>;

    const comment = await invokeGetCommentClubs(channel, id);
    if (!comment) {
      res.status(404).json({ data: { message: 'Not Found' }, meta: req.params });
      return;
    }

    const liked = viewer ? (await invokeGetLiked(channel, id, viewer)) === 1 : false;
    const response: CommentClubs = {
      ...comment,
      id: comment.id.toString('hex'),
      date: chainDateToUI(comment.date),
      owner: await addressBufferToPersona(channel, comment.owner),
      target: comment.target.toString('hex'),
      liked,
    };

    res.status(200).json({ data: response, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
