import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { NFTBase } from '../../../../../types/core/chain/nft';
import { invokeGetAccountStats } from '../../utils/invoker/redeemable_nft_module';
import idBufferToNFT from '../../utils/transformer/idBufferToNFT';
import { minimizeNFT } from '../../utils/transformer/minimizeToBase';
import { validateAddress } from '../../utils/validation/address';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    validateAddress(address);
    const accountStats = await invokeGetAccountStats(channel, address);

    const ret: NFTBase[] = await Promise.all(
      accountStats.momentSlot.map(
        async (item): Promise<NFTBase> => {
          const nft = await idBufferToNFT(channel, item);
          if (!nft) throw new Error('NFT not found while iterating momentSlot');
          return minimizeNFT(nft);
        },
      ),
    );

    res.status(200).json({ data: ret, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
