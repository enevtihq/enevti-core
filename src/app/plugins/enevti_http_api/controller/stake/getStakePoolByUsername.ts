import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { StakePoolData } from '../../../../../types/core/chain/stake';
import addressBufferToPersona from '../../utils/transformer/addressBufferToPersona';
import { invokeGetStakerByAddress } from '../../utils/hook/creator_finance_module.ts';
import { invokeGetAddressByUsername } from '../../utils/hook/persona_module';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const usernameRegistrar = await invokeGetAddressByUsername(channel, username);
    if (!usernameRegistrar) {
      res.status(404).json({ data: { message: 'Not Found' }, meta: req.params });
      return;
    }
    const stakerChain = await invokeGetStakerByAddress(channel, usernameRegistrar.toString('hex'));
    if (!stakerChain) {
      res.status(404).json('Staker data not found');
      return;
    }

    const stake: StakePoolData = {
      owner: await addressBufferToPersona(channel, usernameRegistrar),
      staker: [],
    };

    res.status(200).json({ data: stake, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
