import { apiClient } from 'lisk-sdk';

export function getAssetSchema(client: apiClient.APIClient, moduleID: number, assetID: number) {
  const transactionAssets = client.schemas.transactionsAssets;
  const index = transactionAssets.findIndex(t => t.moduleID === moduleID && t.assetID === assetID);
  if (index === -1) {
    throw new Error('Schema Not Found');
  }
  return transactionAssets[index].schema;
}
