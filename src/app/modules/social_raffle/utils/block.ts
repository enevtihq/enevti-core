import { SocialRaffleBlockRecord } from 'enevti-types/chain/social_raffle';
import { codec, StateStore, BaseModuleDataAccess } from 'lisk-sdk';
import { BLOCK_RECORD_PREFIX, SOCIAL_RAFFLE_PREFIX } from '../constants/codec';
import { raffleBlockRecordSchema } from '../schema/block';

export const accessSocialRaffleBlockRecord = async (
  dataAccess: BaseModuleDataAccess,
  height: number,
): Promise<SocialRaffleBlockRecord> => {
  const blockRecordBuffer = await dataAccess.getChainState(
    `${SOCIAL_RAFFLE_PREFIX}:${height}:${BLOCK_RECORD_PREFIX}`,
  );
  if (!blockRecordBuffer) {
    return { items: [] };
  }
  return codec.decode<SocialRaffleBlockRecord>(raffleBlockRecordSchema, blockRecordBuffer);
};

export const getSocialRaffleBlockRecord = async (
  stateStore: StateStore,
  height: number,
): Promise<SocialRaffleBlockRecord> => {
  const blockRecordBuffer = await stateStore.chain.get(
    `${SOCIAL_RAFFLE_PREFIX}:${height}:${BLOCK_RECORD_PREFIX}`,
  );
  if (!blockRecordBuffer) {
    return { items: [] };
  }
  return codec.decode<SocialRaffleBlockRecord>(raffleBlockRecordSchema, blockRecordBuffer);
};

export const setSocialRaffleBlockRecord = async (
  stateStore: StateStore,
  height: number,
  blockRecord: SocialRaffleBlockRecord,
) => {
  await stateStore.chain.set(
    `${SOCIAL_RAFFLE_PREFIX}:${height}:${BLOCK_RECORD_PREFIX}`,
    codec.encode(raffleBlockRecordSchema, blockRecord),
  );
};
