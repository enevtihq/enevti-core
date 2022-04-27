import { BaseChannel } from 'lisk-framework';
import { invokeGetSchema } from '../hook/app';

export async function getAssetSchema(channel: BaseChannel, moduleID: number, assetID: number) {
  const appSchema = await invokeGetSchema(channel);
  const transactionAssets = appSchema.transactionsAssets as {
    moduleID: number;
    assetID: number;
    schema: Record<string, unknown>;
  }[];

  const index = transactionAssets.findIndex(t => t.moduleID === moduleID && t.assetID === assetID);
  if (index === -1) {
    throw new Error('Schema Not Found');
  }

  return transactionAssets[index].schema;
}
