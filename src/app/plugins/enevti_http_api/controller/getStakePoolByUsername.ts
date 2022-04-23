import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { RegisteredUsernameAsset } from '../../../../types/core/chain/registrar';
import { StakePoolData, StakerChain, StakerItem } from '../../../../types/core/chain/stake';
import addressBufferToPersona from '../utils/addressBufferToPersona';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const usernameRegistrar = await channel.invoke<RegisteredUsernameAsset>(
      'persona:getAddressByUsername',
      { username },
    );
    const stakerChain = await channel.invoke<StakerChain | undefined>(
      'creatorFinance:getStakerByAddress',
      { address: usernameRegistrar.address.toString('hex') },
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
      owner: await addressBufferToPersona(channel, usernameRegistrar.address),
      staker,
    };

    res.status(200).json({ data: stake, meta: {} });
  } catch (err: unknown) {
    res.status(409).json(err);
  }
};
