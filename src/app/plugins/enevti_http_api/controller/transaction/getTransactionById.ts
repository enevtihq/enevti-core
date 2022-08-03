import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { apiClient } from 'lisk-sdk';
import { invokeGetTransactionById } from '../../utils/hook/app';
import { serializer } from '../../utils/transformer/serializer';

export default (channel: BaseChannel, client: apiClient.APIClient) => async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const encodedTx = await invokeGetTransactionById(channel, id);
    if (!encodedTx) {
      res.status(404).json({ data: { message: 'Not Found' }, meta: req.params });
      return;
    }

    const decodedTx = client.transaction.decode(encodedTx);
    const ret = serializer(decodedTx);
    res.status(200).json({ data: ret, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({
      data: (err as string).toString(),
      meta: req.params,
    });
  }
};
