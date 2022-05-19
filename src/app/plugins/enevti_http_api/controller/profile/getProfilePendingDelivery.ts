import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { NFTSecret } from '../../../../../types/core/chain/nft/NFTSecret';
import { invokeGetAccount } from '../../utils/hook/persona_module';
import idBufferToNFT from '../../utils/transformer/idBufferToNFT';
import { validateAddress } from '../../utils/validation/address';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    validateAddress(address);
    const account = await invokeGetAccount(channel, address);

    const ret: { id: string; secret: NFTSecret }[] = await Promise.all(
      account.redeemableNft.pending.map(async pending => {
        const nft = await idBufferToNFT(channel, pending);
        if (!nft) throw new Error('undefined NFT id while iterating redeemableNft.pending');
        return {
          id: nft.id,
          secret: nft.redeem.secret,
        };
      }),
    );

    res.status(200).json({ data: ret, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
