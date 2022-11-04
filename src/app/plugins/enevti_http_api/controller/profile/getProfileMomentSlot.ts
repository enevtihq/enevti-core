import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { NFT } from '../../../../../types/core/chain/nft';
import { invokeGetAccountStats } from '../../utils/invoker/redeemable_nft_module';
import idBufferToNFT from '../../utils/transformer/idBufferToNFT';
import { validateAddress } from '../../utils/validation/address';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    validateAddress(address);
    const accountStats = await invokeGetAccountStats(channel, address);

    const ret: NFT[] = await Promise.all(
      accountStats.momentSlot.map(
        async (item): Promise<NFT> => {
          const nft = await idBufferToNFT(channel, item);
          if (!nft) throw new Error('NFT not found while iterating momentSlot');
          return nft;
        },
      ),
    );

    res.status(200).json({ data: ret, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
