import {
  AddStakeUI,
  AddStakeProps,
} from '../../../../../../types/core/asset/chain/add_stake_asset';
import {
  RegisterUsernameUI,
  RegisterUsernameProps,
} from '../../../../../../types/core/asset/chain/register_username';
import { AppTransaction } from '../../../../../../types/core/service/transaction';

export function registerDelegate(
  payload: AppTransaction<RegisterUsernameUI>,
): AppTransaction<RegisterUsernameProps> {
  return payload;
}

export function voteDelegate(payload: AppTransaction<AddStakeUI>): AppTransaction<AddStakeProps> {
  return {
    ...payload,
    asset: {
      votes: ((payload.asset as { votes: unknown }).votes as {
        delegateAddress: string;
        amount: string;
      }[]).map(item => ({
        delegateAddress: Buffer.from(item.delegateAddress, 'hex'),
        amount: BigInt(item.amount),
      })),
    },
  };
}
