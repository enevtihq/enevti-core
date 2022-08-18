import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';

import { NFTBase } from '../../../../../types/core/chain/nft';
import idBufferToNFT from '../../utils/transformer/idBufferToNFT';
import { invokeGetAccount } from '../../utils/hook/persona_module';
import { validateAddress } from '../../utils/validation/address';
import { minimizeNFT } from '../../utils/transformer/minimizeToBase';
import createPagination from '../../utils/misc/createPagination';

type ProfileOwnedResponse = { checkpoint: number; version: number; data: NFTBase[] };

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const { offset, limit, version } = req.query as Record<string, string>;

    validateAddress(address);
    const account = await invokeGetAccount(channel, address);

    const { v, o, c } = createPagination(
      account.redeemableNft.owned.length,
      version,
      offset,
      limit,
    );

    const ownedAsset = await Promise.all(
      account.redeemableNft.owned.slice(o, c).map(
        async (item): Promise<NFTBase> => {
          const nft = await idBufferToNFT(channel, item);
          if (!nft) throw new Error('NFT not found while iterating account.redeemableNft.owned');
          return minimizeNFT(nft);
        },
      ),
    );

    const response: ProfileOwnedResponse = {
      data: ownedAsset,
      checkpoint: c,
      version: v,
    };

    res.status(200).json({ data: response, meta: { ...req.params, ...req.query } });
  } catch (err: unknown) {
    res
      .status(409)
      .json({ data: (err as string).toString(), meta: { ...req.params, ...req.query } });
  }
};
