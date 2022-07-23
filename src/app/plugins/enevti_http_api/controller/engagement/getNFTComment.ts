import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import {
  invokeGetComment,
  invokeGetLiked,
  invokeGetNFTComment,
} from '../../utils/hook/redeemable_nft_module';
import { Comment, CommentAt } from '../../../../../types/core/chain/engagement';
import chainDateToUI from '../../utils/transformer/chainDateToUI';
import addressBufferToPersona from '../../utils/transformer/addressBufferToPersona';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { offset, limit, version, viewer } = req.query as Record<string, string>;

    const nftComment = await invokeGetNFTComment(channel, id);
    if (!nftComment) {
      res.status(404).json({ data: { message: 'Not Found' }, meta: req.params });
      return;
    }

    const v =
      version === undefined || version === '0' ? nftComment.comment.length : Number(version);
    const o = Number(offset ?? 0) + (nftComment.comment.length - v);
    const l = limit === undefined ? nftComment.comment.length - o : Number(limit);

    const response: CommentAt = {
      comment: await Promise.all(
        nftComment.comment.slice(o, o + l).map(
          async (item): Promise<Comment & { liked: boolean }> => {
            const liked = viewer
              ? (await invokeGetLiked(channel, item.toString('hex'), viewer)) === 1
              : false;
            const commentAsset = await invokeGetComment(channel, item.toString('hex'));
            if (!commentAsset)
              throw new Error('Comment not found while iterating nftComment.comment');
            return {
              ...commentAsset,
              id: commentAsset.id.toString('hex'),
              date: chainDateToUI(commentAsset.date),
              owner: await addressBufferToPersona(channel, commentAsset.owner),
              target: commentAsset.target.toString('hex'),
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
