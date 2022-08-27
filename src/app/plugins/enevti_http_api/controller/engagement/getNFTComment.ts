import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import {
  invokeGetComment,
  invokeGetLiked,
  invokeGetNFTComment,
} from '../../utils/invoker/redeemable_nft_module';
import { Comment, CommentAt } from '../../../../../types/core/chain/engagement';
import chainDateToUI from '../../utils/transformer/chainDateToUI';
import addressBufferToPersona from '../../utils/transformer/addressBufferToPersona';
import { ResponseVersioned } from '../../../../../types/core/service/api';
import createPagination from '../../utils/misc/createPagination';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { offset, limit, version, viewer } = req.query as Record<string, string>;

    const nftComment = await invokeGetNFTComment(channel, id);

    const { v, o, c } = createPagination(nftComment.comment.length, version, offset, limit);

    const response: ResponseVersioned<CommentAt> = {
      version: v,
      checkpoint: c,
      data: {
        comment: await Promise.all(
          nftComment.comment.slice(o, c).map(
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
      },
    };

    res.status(200).json({ data: response, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
