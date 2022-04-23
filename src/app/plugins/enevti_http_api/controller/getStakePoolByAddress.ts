import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { StakePoolData, StakerChain, StakerItem } from '../../../../types/core/chain/stake';
import addressBufferToPersona from '../utils/addressBufferToPersona';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const stakerChain = await channel.invoke<StakerChain | undefined>(
      'creatorFinance:getStakerByAddress',
      { address },
    );
    if (!stakerChain) {
      res.status(404).json('Staker data not found');
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
