import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { Reply } from '../../../../../types/core/chain/engagement';
import { invokeGetLiked, invokeGetReply } from '../../utils/hook/redeemable_nft_module';
import addressBufferToPersona from '../../utils/transformer/addressBufferToPersona';
import chainDateToUI from '../../utils/transformer/chainDateToUI';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { viewer } = req.query as Record<string, string>;

    const reply = await invokeGetReply(channel, id);
    if (!reply) {
      res.status(404).json({ data: { message: 'Not Found' }, meta: req.params });
      return;
    }

    const liked = viewer ? (await invokeGetLiked(channel, id, viewer)) === 1 : false;
    const response: Reply = {
      ...reply,
      id: reply.id.toString('hex'),
      date: chainDateToUI(reply.date),
      owner: await addressBufferToPersona(channel, reply.owner),
      target: reply.target.toString('hex'),
      liked,
    };

    res.status(200).json({ data: response, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
