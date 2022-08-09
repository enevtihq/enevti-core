import { BaseChannel } from 'lisk-framework';
import { Server, Socket } from 'socket.io';
import * as admin from 'firebase-admin';
import { sendDataOnlyTopicMessaging } from '../../utils/firebase';
import idBufferToCollection from '../../../enevti_http_api/utils/transformer/idBufferToCollection';

export function onNewRaffled(
  channel: BaseChannel,
  io: Server | Socket,
  firebaseAdmin: typeof admin | undefined,
) {
  channel.subscribe('redeemableNft:newRaffled', async data => {
    if (data) {
      const payload = data as { address: string; collection: string; total: number };
      const collection = await idBufferToCollection(
        channel,
        Buffer.from(payload.collection, 'hex'),
      );
      if (!collection) throw new Error('undefined Collection id while subscribing newRaffled');
      const message = { collection, total: payload.total };
      if (firebaseAdmin) {
        try {
          await sendDataOnlyTopicMessaging(payload.address, 'newRaffled', message);
        } catch (err) {
          io.to(payload.address).emit(`newRaffled`, message);
        }
      } else {
        io.to(payload.address).emit(`newRaffled`, message);
      }
    }
  });
}

export function onWonRaffle(
  channel: BaseChannel,
  io: Server | Socket,
  firebaseAdmin: typeof admin | undefined,
) {
  channel.subscribe('redeemableNft:wonRaffle', async data => {
    if (data) {
      const payload = data as { address: string; collection: string; items: string[] };
      const collection = await idBufferToCollection(
        channel,
        Buffer.from(payload.collection, 'hex'),
      );
      if (!collection) throw new Error('undefined Collection id while subscribing wonRaffle');
      const message = { collection, total: payload.items.length };
      if (firebaseAdmin) {
        try {
          await sendDataOnlyTopicMessaging(payload.address, 'wonRaffle', message);
        } catch (err) {
          io.to(payload.address).emit(`wonRaffle`, message);
        }
      } else {
        io.to(payload.address).emit(`wonRaffle`, message);
      }
    }
  });
}
