import { AccountSchema } from 'lisk-framework';

export const creafiAccountSchema: AccountSchema = {
  type: 'object',
  properties: {
    totalStake: {
      dataType: 'uint64',
      fieldNumber: 1,
    },
  },
  default: {
    totalStake: BigInt(0),
  },
};
