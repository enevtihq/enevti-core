import { BaseModuleDataAccess, StateStore } from 'lisk-framework';
import { codec } from 'lisk-sdk';
import { ReplyAsset } from 'enevti-types/chain/engagement';
import { CHAIN_STATE_REPLY } from '../../../constants/codec';
import { replySchema } from '../../../schemas/chain/engagement';

export const accessReplyById = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
): Promise<ReplyAsset | undefined> => {
  const replyBuffer = await dataAccess.getChainState(`${CHAIN_STATE_REPLY}:${id}`);
  if (!replyBuffer) {
    return undefined;
  }
  return codec.decode<ReplyAsset>(replySchema, replyBuffer);
};

export const getReplyById = async (
  stateStore: StateStore,
  id: string,
): Promise<ReplyAsset | undefined> => {
  const replyBuffer = await stateStore.chain.get(`${CHAIN_STATE_REPLY}:${id}`);
  if (!replyBuffer) {
    return undefined;
  }
  return codec.decode<ReplyAsset>(replySchema, replyBuffer);
};

export const setReplyById = async (stateStore: StateStore, id: string, reply: ReplyAsset) => {
  await stateStore.chain.set(`${CHAIN_STATE_REPLY}:${id}`, codec.encode(replySchema, reply));
};
