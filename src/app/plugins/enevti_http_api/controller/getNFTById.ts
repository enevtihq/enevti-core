import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { NFTAsset } from '../../../../types/core/chain/nft';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const nft = await channel.invoke<NFTAsset | undefined>('redeemableNft:getNFT', {
      id,
    });

    res.status(200).json({ data: nft, meta: {} });
  } catch (err: unknown) {
    res.status(409).json(err);
  }
};
