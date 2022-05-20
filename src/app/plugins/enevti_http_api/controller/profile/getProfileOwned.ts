import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';

import { NFTBase } from '../../../../../types/core/chain/nft';
import idBufferToNFT from '../../utils/transformer/idBufferToNFT';
import { invokeGetAccount } from '../../utils/hook/persona_module';
import { validateAddress } from '../../utils/validation/address';
import { minimizeNFT } from '../../utils/transformer/minimizeToBase';

type ProfileOwnedResponse = { checkpoint: number; version: number; data: NFTBase[] };

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const { offset, limit, version } = req.query as Record<string, string>;

    validateAddress(address);
    const account = await invokeGetAccount(channel, address);

    const v =
      version === undefined || version === '0'
        ? account.redeemableNft.owned.length
        : Number(version);
    const o = Number(offset ?? 0) + (account.redeemableNft.owned.length - v);
    const l = limit === undefined ? account.redeemableNft.owned.length - o : Number(limit);

    const ownedAsset = await Promise.all(
      account.redeemableNft.owned.slice(o, o + l).map(
        async (item): Promise<NFTBase> => {
          const nft = await idBufferToNFT(channel, item);
          if (!nft) throw new Error('NFT not found while iterating account.redeemableNft.owned');
          return minimizeNFT(nft);
        },
      ),
    );

    const response: ProfileOwnedResponse = {
      data: ownedAsset,
      checkpoint: o + l,
      version: v,
    };

    res.status(200).json({ data: response, meta: { ...req.params, ...req.query } });
  } catch (err: unknown) {
    res
      .status(409)
      .json({ data: (err as string).toString(), meta: { ...req.params, ...req.query } });
  }
};
