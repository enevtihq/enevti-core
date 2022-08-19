import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { invokeGetCollection } from '../../utils/hook/redeemable_nft_module';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { address } = req.query as Record<string, string>;
    const collection = await invokeGetCollection(channel, id);
    if (!collection) {
      throw new Error('Collection not found');
    }

    let isOwnerOrCreator = true;

    if (
      Buffer.compare(collection.creator, Buffer.from(address, 'hex')) !== 0 &&
      collection.stat.owner.findIndex(o => Buffer.compare(o, Buffer.from(address, 'hex')) === 0) ===
        -1
    ) {
      isOwnerOrCreator = false;
    }

    res.status(200).json({ data: isOwnerOrCreator, meta: req.query });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.query });
  }
};
