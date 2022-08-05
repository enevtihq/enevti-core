import { codec, StateStore, BaseModuleDataAccess } from 'lisk-sdk';
import { RedeemableNFTAccountStatsChain } from '../../../../types/core/account/profile';
import { CHAIN_STATE_ACCOUNT_STATS } from '../constants/codec';
import { accountStatsSchema } from '../schemas/chain/account_stats';

export const accessAccountStats = async (
  dataAccess: BaseModuleDataAccess,
  address: string,
): Promise<RedeemableNFTAccountStatsChain> => {
  const accountStats = await dataAccess.getChainState(`${CHAIN_STATE_ACCOUNT_STATS}:${address}`);
  if (!accountStats) {
    return {
      nftSold: [],
      raffled: [],
      treasuryAct: [],
      serveRate: { score: 0, items: [] },
      likeSent: { total: 0, nft: [], collection: [], comment: [], reply: [] },
    };
  }
  return codec.decode<RedeemableNFTAccountStatsChain>(accountStatsSchema, accountStats);
};

export const getAccountStats = async (
  stateStore: StateStore,
  address: string,
): Promise<RedeemableNFTAccountStatsChain> => {
  const accountStats = await stateStore.chain.get(`${CHAIN_STATE_ACCOUNT_STATS}:${address}`);
  if (!accountStats) {
    return {
      nftSold: [],
      raffled: [],
      treasuryAct: [],
      serveRate: { score: 0, items: [] },
      likeSent: { total: 0, nft: [], collection: [], comment: [], reply: [] },
    };
  }
  return codec.decode<RedeemableNFTAccountStatsChain>(accountStatsSchema, accountStats);
};

export const setAccountStats = async (
  stateStore: StateStore,
  address: string,
  accountStats: RedeemableNFTAccountStatsChain,
) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_ACCOUNT_STATS}:${address}`,
    codec.encode(accountStatsSchema, accountStats),
  );
};
