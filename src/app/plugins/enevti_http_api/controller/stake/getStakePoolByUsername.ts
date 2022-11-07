import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { StakePoolData, StakerItem } from '../../../../../types/core/chain/stake';
import addressBufferToPersona from '../../utils/transformer/addressBufferToPersona';
import { invokeGetStakerByAddress } from '../../utils/invoker/creator_finance_module.ts';
import { invokeGetAddressByUsername } from '../../utils/invoker/persona_module';
import { STAKER_INITIAL_LENGTH } from '../../constant/limit';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const { staker } = req.query as Record<string, 'true' | 'false' | undefined>;
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

    const stakerVersions = staker === 'true' ? stakerChain.items.length : 0;
    const stakerData =
      staker === 'true'
        ? await Promise.all(
            stakerChain.items.slice(0, STAKER_INITIAL_LENGTH).map(
              async (item): Promise<StakerItem> => {
                const persona = await addressBufferToPersona(channel, item.persona);
                return {
                  ...item,
                  id: item.id.toString('hex'),
                  persona,
                  stake: item.stake.toString(),
                };
              },
            ),
          )
        : [];

    const stake: StakePoolData = {
      owner: await addressBufferToPersona(channel, usernameRegistrar),
      staker: stakerData,
    };

    const version = {
      stakePool: stakerVersions,
    };

    res.status(200).json({ data: stake, version, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
