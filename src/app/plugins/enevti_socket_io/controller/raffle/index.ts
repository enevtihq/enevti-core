import { BaseChannel } from 'lisk-framework';
import { Server, Socket } from 'socket.io';
import * as admin from 'firebase-admin';
import { sendDataOnlyTopicMessaging } from '../../utils/firebase';

export function onNewRaffled(
  channel: BaseChannel,
  io: Server | Socket,
  firebaseAdmin: typeof admin | undefined,
) {
  channel.subscribe('redeemableNft:newRaffled', async data => {
    if (data) {
      const payload = data as { address: string; collection: string; total: number };
      if (firebaseAdmin) {
        try {
          await sendDataOnlyTopicMessaging(payload.address, 'newRaffled', JSON.stringify(payload));
        } catch (err) {
          io.to(payload.address).emit(`newRaffled`, payload);
        }
      } else {
        io.to(payload.address).emit(`newRaffled`, payload);
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
      if (firebaseAdmin) {
        try {
          await sendDataOnlyTopicMessaging(payload.address, 'wonRaffle', JSON.stringify(payload));
        } catch (err) {
          io.to(payload.address).emit(`wonRaffle`, payload);
        }
      } else {
        io.to(payload.address).emit(`wonRaffle`, payload);
      }
    }
  });
}
