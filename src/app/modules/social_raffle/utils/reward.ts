import { AfterBlockApplyContext } from 'lisk-framework';
import { cryptography } from 'lisk-sdk';

export const debitBlockReward = async (input: AfterBlockApplyContext, amount: bigint) => {
  const generatorAddress = cryptography.getAddressFromPublicKey(
    input.block.header.generatorPublicKey,
  );
  if (amount > BigInt(0)) {
    await input.reducerHandler.invoke('token:debit', {
      address: generatorAddress,
      amount,
    });
  }
};
