import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { apiClient } from 'lisk-sdk';
import { invokeGetTransactionsFromPool, invokeGetTransactionById } from '../../utils/hook/app';

export default (channel: BaseChannel, client: apiClient.APIClient) => async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;

    const transactionFromId = await invokeGetTransactionById(channel, id);
    if (transactionFromId) {
      res.status(200).json({ data: 'sent', meta: req.params });
      return;
    }

    const transactionPool = await invokeGetTransactionsFromPool(channel);
    const index = transactionPool
      .map(tx => client.transaction.decode(tx))
      .findIndex(tx => (tx as { id: Buffer }).id.toString('hex') === id);
    if (index !== -1) {
      res.status(200).json({ data: 'pending', meta: req.params });
      return;
    }

    res.status(404).json({ data: 'not-found', meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({
      data: (err as string).toString(),
      meta: req.params,
    });
  }
};
