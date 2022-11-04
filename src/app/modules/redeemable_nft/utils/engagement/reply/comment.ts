import { BaseModuleDataAccess, StateStore } from 'lisk-framework';
import { codec } from 'lisk-sdk';
import { ReplyAtAsset, ReplyAsset } from '../../../../../../types/core/chain/engagement';
import { CHAIN_STATE_REPLY } from '../../../constants/codec';
import { replyAtSchema } from '../../../schemas/chain/engagement';
import { getReplyById, setReplyById } from './reply';

export const accessCommentReplyById = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
): Promise<ReplyAtAsset> => {
  const commentReplyBuffer = await dataAccess.getChainState(`${CHAIN_STATE_REPLY}:comment:${id}`);
  if (!commentReplyBuffer) {
    return { reply: [] };
  }
  return codec.decode<ReplyAtAsset>(replyAtSchema, commentReplyBuffer);
};

export const getCommentReplyById = async (
  stateStore: StateStore,
  id: string,
): Promise<ReplyAtAsset> => {
  const commentReplyBuffer = await stateStore.chain.get(`${CHAIN_STATE_REPLY}:comment:${id}`);
  if (!commentReplyBuffer) {
    return { reply: [] };
  }
  return codec.decode<ReplyAtAsset>(replyAtSchema, commentReplyBuffer);
};

export const setCommentReplyById = async (
  stateStore: StateStore,
  id: string,
  reply: ReplyAtAsset,
) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_REPLY}:comment:${id}`,
    codec.encode(replyAtSchema, reply),
  );
};

export const addCommentReplyById = async (
  stateStore: StateStore,
  id: string,
  reply: ReplyAsset,
) => {
  const commentReply = await getCommentReplyById(stateStore, id);
  if (!commentReply) {
    await setCommentReplyById(stateStore, id, { reply: [reply.id] });
    return;
  }

  commentReply.reply.push(reply.id);
  await setCommentReplyById(stateStore, id, commentReply);

  const replyBuffer = await getReplyById(stateStore, reply.id.toString('hex'));
  if (!replyBuffer) {
    await setReplyById(stateStore, reply.id.toString('hex'), reply);
  } else {
    throw Error('Reply already exist');
  }
};
