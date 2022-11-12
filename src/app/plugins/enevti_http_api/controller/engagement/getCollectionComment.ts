import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import {
  invokeGetCollectionComment,
  invokeGetComment,
  invokeGetLiked,
} from '../../utils/invoker/redeemable_nft_module';
import { Comment, CommentAt } from '../../../../../types/core/chain/engagement';
import chainDateToUI from '../../utils/transformer/chainDateToUI';
import addressBufferToPersona from '../../utils/transformer/addressBufferToPersona';
import { ResponseVersioned } from '../../../../../types/core/service/api';
import createPagination from '../../utils/misc/createPagination';
import { invokeGetIPFSTextCache } from '../../../ipfs_text_cache/utils/invoker';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { offset, limit, version, viewer } = req.query as Record<string, string>;

    const collectionComment = await invokeGetCollectionComment(channel, id);

    const { v, o, c } = createPagination(collectionComment.comment.length, version, offset, limit);

    const response: ResponseVersioned<CommentAt> = {
      checkpoint: c,
      version: v,
      data: {
        comment: await Promise.all(
          collectionComment.comment.slice(o, c).map(
            async (item): Promise<Comment & { liked: boolean }> => {
              const liked = viewer
                ? (await invokeGetLiked(channel, item.toString('hex'), viewer)) === 1
                : false;
              const commentAsset = await invokeGetComment(channel, item.toString('hex'));
              if (!commentAsset)
                throw new Error('Comment not found while iterating collectionComment.comment');
              return {
                ...commentAsset,
                id: commentAsset.id.toString('hex'),
                date: chainDateToUI(commentAsset.date),
                owner: await addressBufferToPersona(channel, commentAsset.owner),
                target: commentAsset.target.toString('hex'),
                text: await invokeGetIPFSTextCache(channel, commentAsset.data),
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
