import { BaseModuleDataAccess, StateStore } from 'lisk-framework';
import { codec } from 'lisk-sdk';
import { ReplyAsset } from 'enevti-types/chain/engagement';
import { CHAIN_STATE_REPLY_CLUBS } from '../../../constants/codec';
import { replySchema } from '../../../schemas/chain/engagement';

export const accessReplyClubsById = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
): Promise<ReplyAsset | undefined> => {
  const replyBuffer = await dataAccess.getChainState(`${CHAIN_STATE_REPLY_CLUBS}:${id}`);
  if (!replyBuffer) {
    return undefined;
  }
  return codec.decode<ReplyAsset>(replySchema, replyBuffer);
};

export const getReplyClubsById = async (
  stateStore: StateStore,
  id: string,
): Promise<ReplyAsset | undefined> => {
  const replyBuffer = await stateStore.chain.get(`${CHAIN_STATE_REPLY_CLUBS}:${id}`);
  if (!replyBuffer) {
    return undefined;
  }
  return codec.decode<ReplyAsset>(replySchema, replyBuffer);
};

export const setReplyClubsById = async (stateStore: StateStore, id: string, reply: ReplyAsset) => {
  await stateStore.chain.set(`${CHAIN_STATE_REPLY_CLUBS}:${id}`, codec.encode(replySchema, reply));
};
