import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { invokeGetCollectionIdFromSymbol } from '../../utils/invoker/redeemable_nft_module';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const collectionId = await invokeGetCollectionIdFromSymbol(channel, symbol);
    if (!collectionId) {
      res.status(404).json({ data: { message: 'Not Found' }, meta: req.params });
      return;
    }

    res.status(200).json({ data: collectionId.toString('hex'), meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
