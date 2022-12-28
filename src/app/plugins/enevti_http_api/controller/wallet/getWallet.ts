import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { apiClient } from 'lisk-sdk';
import { ProfileActivity } from '../../../../../types/core/account/profile';

import { WalletView } from '../../../../../types/core/service/wallet';
import { WALLET_HISTORY_INITIAL_LENGTH } from '../../constant/limit';
import { invokeGetAccount } from '../../utils/invoker/persona_module';
import idBufferToActivityProfile from '../../utils/transformer/idBufferToActivityProfile';
import { validateAddress } from '../../utils/validation/address';
import { isNumeric } from '../../utils/validation/number';

export default (channel: BaseChannel, client: apiClient.APIClient) => async (
  req: Request,
  res: Response,
) => {
  try {
    const { address } = req.params;
    const { history, viewer } = req.query as Record<string, string>;
    validateAddress(address);
    const account = await invokeGetAccount(channel, address);

    const staked = account.dpos.sentVotes.reduce(
      (prev, current) => prev + current.amount,
      BigInt(0),
    );

    let historyDataVersions = 0;
    let historyData: ProfileActivity[] = [];
    if (history && isNumeric(history)) {
      const profileActivity = await idBufferToActivityProfile(
        channel,
        client,
        Buffer.from(address, 'hex'),
        viewer,
      );
      historyData = profileActivity.slice(
        0,
        history === '0' ? WALLET_HISTORY_INITIAL_LENGTH : parseInt(history, 10),
      );
      historyDataVersions = profileActivity.length;
    }

    const wallet: Omit<WalletView, 'version' | 'fetchedVersion'> = {
      balance: account.token.balance.toString(),
      staked: staked.toString(),
      history: historyData,
    };

    const version = {
      history: historyDataVersions,
    };

    res.status(200).json({ data: wallet, version, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), version: {}, meta: req.params });
  }
};
