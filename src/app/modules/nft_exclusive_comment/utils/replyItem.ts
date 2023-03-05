import { StateStore } from 'lisk-sdk';
import { ExclusiveReplyItemChain } from 'enevti-types/chain/nft_exclusive_comment';
import { BaseModuleDataAccess } from 'lisk-framework';
import { accessExclusiveComment, getExclusiveComment, setExclusiveComment } from './commentItem';

export const accessExclusiveReply: (
  dataAccess: BaseModuleDataAccess,
  id: Buffer,
) => Promise<ExclusiveReplyItemChain | undefined> = accessExclusiveComment;

export const getExclusiveReply: (
  stateStore: StateStore,
  id: Buffer,
) => Promise<ExclusiveReplyItemChain | undefined> = getExclusiveComment;

export const setExclusiveReply: (
  stateStore: StateStore,
  id: Buffer,
  reply: ExclusiveReplyItemChain,
) => Promise<void> = setExclusiveComment;
