import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { invokeGetSchema } from '../../utils/hook/app';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { moduleID, assetID } = req.params;
    const appSchema = await invokeGetSchema(channel);
    const transactionAssets = appSchema.transactionsAssets as {
      moduleID: number;
      assetID: number;
      schema: Record<string, unknown>;
    }[];

    const index = transactionAssets.findIndex(
      t => t.moduleID === parseInt(moduleID, 10) && t.assetID === parseInt(assetID, 10),
    );
    if (index === -1) {
      res.status(404).json({ data: { message: 'Not Found' }, meta: req.params });
      return;
    }

    res.status(200).json({ data: transactionAssets[index].schema, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: err, meta: req.params });
  }
};
