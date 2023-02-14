import { TransferTokenUI, TransferTokenProps } from 'enevti-types/asset/token/transfer_asset';
import { AppTransaction } from 'enevti-types/service/transaction';

export function transferToken(
  payload: AppTransaction<TransferTokenUI>,
): AppTransaction<TransferTokenProps> {
  return {
    ...payload,
    asset: {
      ...payload.asset,
      amount: BigInt(payload.asset.amount),
      recipientAddress: Buffer.from(payload.asset.recipientAddress, 'hex'),
    },
  };
}
