import { Transaction, GenesisConfig } from 'lisk-sdk';
import { Block } from '@liskhq/lisk-chain';
import { DynamicBaseFeeGenesisConfig } from 'enevti-types/chain/dynamic_base_fee/config';

export function getBaseFee(config: GenesisConfig, tx: { moduleID: number; assetID: number }) {
  let ret = '0';
  const index = config.baseFees.findIndex(
    t => t.moduleID === tx.moduleID && t.assetID === tx.assetID,
  );
  if (index !== -1) ret = config.baseFees[index].baseFee;
  return BigInt(ret);
}

export function getDynamicBaseFeePerByte(
  config: GenesisConfig & DynamicBaseFeeGenesisConfig,
  tx: { moduleID: number; assetID: number },
) {
  if (!config.defaultMinFeePerByte || !config.dynamicBaseFees) return 0;
  let minFeePerByte = config.defaultMinFeePerByte;
  for (const dynamicBaseFee of config.dynamicBaseFees) {
    if (dynamicBaseFee.moduleID === tx.moduleID && dynamicBaseFee.assetID === tx.assetID) {
      minFeePerByte = dynamicBaseFee.minFeePerByte;
      break;
    }
  }
  return minFeePerByte;
}

export function getDynamicBaseFee(
  config: GenesisConfig & DynamicBaseFeeGenesisConfig,
  transaction: Transaction,
) {
  if (!config.defaultMinFeePerByte || !config.dynamicBaseFees) return BigInt(0);
  const minFeePerByte = getDynamicBaseFeePerByte(config, transaction);
  const minFee = BigInt(minFeePerByte) * BigInt(transaction.getBytes().length);
  return minFee;
}

export const getTotalFees = (config: GenesisConfig & DynamicBaseFeeGenesisConfig, block: Block) =>
  block.payload.reduce(
    (prev, current) => {
      const baseFee =
        config.baseFees.find(
          (fee: { moduleID: number; assetID: number }) =>
            fee.moduleID === current.moduleID && fee.assetID === current.assetID,
        )?.baseFee ?? '0';
      const dynamicBaseFee = getDynamicBaseFee(config, current);

      return {
        totalFee: prev.totalFee + current.fee,
        totalBaseFee: prev.totalBaseFee + BigInt(baseFee),
        totalDynamicBaseFee: prev.totalDynamicBaseFee + dynamicBaseFee,
      };
    },
    { totalFee: BigInt(0), totalBaseFee: BigInt(0), totalDynamicBaseFee: BigInt(0) },
  );
