import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { Persona } from '../../../../../types/core/account/persona';
import { NFTBase } from '../../../../../types/core/chain/nft';
import { invokeGetNFTIdFromSerial } from '../../utils/hook/redeemable_nft_module';
import idBufferToNFT from '../../utils/transformer/idBufferToNFT';
import { minimizeNFT } from '../../utils/transformer/minimizeToBase';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { q } = req.query as Record<string, string>;
    const nftId = await invokeGetNFTIdFromSerial(channel, decodeURIComponent(q));
    if (!nftId) {
      res.status(200).json({ data: [], meta: req.query });
      return;
    }

    const nft = await idBufferToNFT(channel, nftId);
    if (!nft) {
      res.status(200).json({ data: [], meta: req.query });
      return;
    }

    const response: (NFTBase & { owner: Persona })[] = [{ ...minimizeNFT(nft), owner: nft.owner }];

    res.status(200).json({ data: response, meta: req.query });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.query });
  }
};
