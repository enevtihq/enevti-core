import { BaseModuleDataAccess, StateStore } from 'lisk-framework';
import { codec } from 'lisk-sdk';
import { ReplyAtAsset, ReplyAsset } from '../../../../../../types/core/chain/engagement';
import { CHAIN_STATE_REPLY_CLUBS } from '../../../constants/codec';
import { replyAtSchema } from '../../../schemas/chain/engagement';
import { getReplyClubsById, setReplyClubsById } from './clubs';

export const accessCommentClubsReplyById = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
): Promise<ReplyAtAsset> => {
  const commentReplyBuffer = await dataAccess.getChainState(
    `${CHAIN_STATE_REPLY_CLUBS}:comment:${id}`,
  );
  if (!commentReplyBuffer) {
    return { reply: [] };
  }
  return codec.decode<ReplyAtAsset>(replyAtSchema, commentReplyBuffer);
};

export const getCommentClubsReplyById = async (
  stateStore: StateStore,
  id: string,
): Promise<ReplyAtAsset> => {
  const commentReplyBuffer = await stateStore.chain.get(`${CHAIN_STATE_REPLY_CLUBS}:comment:${id}`);
  if (!commentReplyBuffer) {
    return { reply: [] };
  }
  return codec.decode<ReplyAtAsset>(replyAtSchema, commentReplyBuffer);
};

export const setCommentClubsReplyById = async (
  stateStore: StateStore,
  id: string,
  reply: ReplyAtAsset,
) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_REPLY_CLUBS}:comment:${id}`,
    codec.encode(replyAtSchema, reply),
  );
};

export const addCommentClubsReplyById = async (
  stateStore: StateStore,
  id: string,
  reply: ReplyAsset,
) => {
  const commentReply = await getCommentClubsReplyById(stateStore, id);
  if (!commentReply) {
    await setCommentClubsReplyById(stateStore, id, { reply: [reply.id] });
    return;
  }

  commentReply.reply.push(reply.id);
  await setCommentClubsReplyById(stateStore, id, commentReply);

  const replyBuffer = await getReplyClubsById(stateStore, reply.id.toString('hex'));
  if (!replyBuffer) {
    await setReplyClubsById(stateStore, reply.id.toString('hex'), reply);
  } else {
    throw Error('Reply already exist');
  }
};
