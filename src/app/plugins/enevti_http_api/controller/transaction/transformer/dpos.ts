import { AddStakeUI, AddStakeProps } from 'enevti-types/asset/chain/add_stake_asset';
import {
  RegisterUsernameUI,
  RegisterUsernameProps,
} from 'enevti-types/asset/chain/register_username';
import { AppTransaction } from 'enevti-types/service/transaction';

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
