import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { Persona } from 'enevti-types/account/persona';
import { NFTBase } from 'enevti-types/chain/nft';
import idBufferToNFT from '../../utils/transformer/idBufferToNFT';
import { minimizeNFT } from '../../utils/transformer/minimizeToBase';
import { invokeGetRegistrar } from '../../utils/invoker/registrar';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { q } = req.query as Record<string, string>;
    const serialRegistrar = await invokeGetRegistrar(channel, 'serial', decodeURIComponent(q));
    if (!serialRegistrar) {
      res.status(200).json({ data: [], meta: req.query });
      return;
    }

    const nft = await idBufferToNFT(channel, serialRegistrar.id);
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
