import { apiClient, Schema } from 'lisk-sdk';

export async function getAssetSchema(
  client: apiClient.APIClient,
  moduleID: number,
  assetID: number,
): Promise<Schema> {
  const appSchema = await client.invoke('app:getSchema');
  const transactionAssets = appSchema.transactionsAssets as {
    moduleID: number;
    assetID: number;
    schema: Record<string, unknown>;
  }[];

  const index = transactionAssets.findIndex(t => t.moduleID === moduleID && t.assetID === assetID);
  if (index === -1) {
    throw new Error('Schema Not Found');
  }

  return (transactionAssets[index].schema as unknown) as Schema;
}
