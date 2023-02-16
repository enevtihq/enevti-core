import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { StakePoolData, StakerItem } from 'enevti-types/chain/stake';
import addressBufferToPersona from '../../utils/transformer/addressBufferToPersona';
import { invokeGetStakerByAddress } from '../../utils/invoker/creator_finance_module.ts';
import { STAKER_INITIAL_LENGTH } from '../../constant/limit';
import { isNumeric } from '../../utils/validation/number';
import { invokeGetRegistrar } from '../../utils/invoker/registrar';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const { staker } = req.query as Record<string, string>;
    const usernameRegistrar = await invokeGetRegistrar(channel, 'username', username);
    if (!usernameRegistrar) {
      res.status(404).json({ data: { message: 'Not Found' }, version: {}, meta: req.params });
      return;
    }
    const stakerChain = await invokeGetStakerByAddress(
      channel,
      usernameRegistrar.id.toString('hex'),
    );
    if (!stakerChain) {
      res.status(404).json({ data: { message: 'Not Found' }, version: {}, meta: req.params });
      return;
    }

    const stakerVersions = staker && isNumeric(staker) ? stakerChain.items.length : 0;
    const stakerData =
      staker && isNumeric(staker)
        ? await Promise.all(
            stakerChain.items
              .slice(0, staker === '0' ? STAKER_INITIAL_LENGTH : parseInt(staker, 10))
              .map(
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
      owner: await addressBufferToPersona(channel, usernameRegistrar.id),
      staker: stakerData,
    };

    const version = {
      stakePool: stakerVersions,
    };

    res.status(200).json({ data: stake, version, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), version: {}, meta: req.params });
  }
};
