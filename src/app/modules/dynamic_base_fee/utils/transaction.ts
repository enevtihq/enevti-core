import { Transaction } from 'lisk-framework';
import { codec, Schema } from 'lisk-sdk';

export function transactionClassToObject(
  transaction: Transaction,
  schema: Schema,
): Record<string, unknown> {
  return {
    moduleID: transaction.moduleID,
    assetID: transaction.assetID,
    asset: codec.decode(schema, transaction.asset),
    nonce: transaction.nonce,
    fee: transaction.fee,
    senderPublicKey: transaction.senderPublicKey,
    signatures: transaction.signatures,
    id: transaction.id,
  };
}
