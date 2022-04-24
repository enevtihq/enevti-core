import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { StakePoolData, StakerItem } from '../../../../types/core/chain/stake';
import addressBufferToPersona from '../utils/addressBufferToPersona';
import { invokeGetStakerByAddress } from '../utils/hook/creator_finance_module.ts';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const stakerChain = await invokeGetStakerByAddress(channel, address);
    if (!stakerChain) {
      res.status(404).json('Not Found');
      return;
    }
    const staker = await Promise.all(
      stakerChain.items.map(
        async (item): Promise<StakerItem> => {
          const persona = await addressBufferToPersona(channel, item.persona);
          return {
            ...item,
            persona,
            stake: item.stake.toString(),
          };
        },
      ),
    );

    const stake: StakePoolData = {
      owner: await addressBufferToPersona(channel, Buffer.from(address, 'hex')),
      staker,
    };

    res.status(200).json({ data: stake, meta: {} });
  } catch (err: unknown) {
    res.status(409).json(err);
  }
};
