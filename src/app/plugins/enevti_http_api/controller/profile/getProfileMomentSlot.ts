import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { NFTBase } from '../../../../../types/core/chain/nft';
import { invokeGetAccountStats } from '../../utils/invoker/redeemable_nft_module';
import createPagination from '../../utils/misc/createPagination';
import idBufferToNFT from '../../utils/transformer/idBufferToNFT';
import { minimizeNFT } from '../../utils/transformer/minimizeToBase';
import { validateAddress } from '../../utils/validation/address';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const { offset, limit, version } = req.query as Record<string, string>;

    validateAddress(address);
    const accountStats = await invokeGetAccountStats(channel, address);
    const { v, o, c } = createPagination(accountStats.momentSlot.length, version, offset, limit);

    const response = {
      checkpoint: c,
      version: v,
      data: await Promise.all(
        accountStats.momentSlot.slice(o, c).map(
          async (item): Promise<NFTBase> => {
            const nft = await idBufferToNFT(channel, item);
            if (!nft) throw new Error('NFT not found while iterating momentSlot');
            return minimizeNFT(nft);
          },
        ),
      ),
    };

    res.status(200).json({ data: response, meta: { ...req.params, ...req.query } });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
