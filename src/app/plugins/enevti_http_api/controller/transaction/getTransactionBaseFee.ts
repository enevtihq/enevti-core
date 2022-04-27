import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { invokeGetNodeIndo } from '../../utils/hook/app';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { moduleID, assetID } = req.params;
    const nodeInfo = await invokeGetNodeIndo(channel);
    const {
      genesisConfig: { baseFees },
    } = nodeInfo as {
      genesisConfig: { baseFees: { moduleID: number; assetID: number; baseFee: string }[] };
    };
    const index = baseFees.findIndex(
      t => t.moduleID === parseInt(moduleID, 10) && t.assetID === parseInt(assetID, 10),
    );
    if (index === -1) {
      throw new Error('BaseFee Not Found');
    }

    res.status(200).json({ data: baseFees[index].baseFee, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({
      data: (err as string).toString(),
      meta: req.params,
    });
  }
};
