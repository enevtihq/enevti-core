import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { NFTActivity } from '../../../../../types/core/chain/nft/NFTActivity';
import createPagination from '../../utils/misc/createPagination';
import idBufferToActivityNFT from '../../utils/transformer/idBufferToActivityNFT';

type ProfileOwnedResponse = { checkpoint: number; version: number; data: NFTActivity[] };

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { offset, limit, version } = req.query as Record<string, string>;

    const collectionActivity = await idBufferToActivityNFT(channel, Buffer.from(id, 'hex'));

    const { v, o, c } = createPagination(collectionActivity.length, version, offset, limit);

    const ret: NFTActivity[] = collectionActivity.slice(o, c);

    const response: ProfileOwnedResponse = {
      data: ret,
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
