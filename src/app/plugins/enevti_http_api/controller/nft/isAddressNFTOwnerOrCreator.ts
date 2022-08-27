import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { invokeGetNFT } from '../../utils/invoker/redeemable_nft_module';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { address } = req.query as Record<string, string>;
    const nft = await invokeGetNFT(channel, id);
    if (!nft) {
      throw new Error('NFT not found');
    }

    let isOwnerOrCreator = true;

    if (
      Buffer.compare(nft.creator, Buffer.from(address, 'hex')) !== 0 &&
      Buffer.compare(nft.owner, Buffer.from(address, 'hex')) !== 0
    ) {
      isOwnerOrCreator = false;
    }

    res.status(200).json({ data: isOwnerOrCreator, meta: req.query });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.query });
  }
};
