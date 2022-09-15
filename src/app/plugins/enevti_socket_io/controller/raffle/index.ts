import { BaseChannel } from 'lisk-framework';
import { Server, Socket } from 'socket.io';
import { sendDataOnlyTopicMessaging } from '../../utils/firebase';
import idBufferToCollection from '../../../enevti_http_api/utils/transformer/idBufferToCollection';
import { getSocketIdByAddress } from '../../utils/mapper';
import { invokeFCMIsReady } from '../../../firebase_cloud_messaging/utils/invoker';
import { delayEmit } from '../../utils/delayEmit';

export function onNewRaffled(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('redeemableNft:newRaffled', async data => {
    if (data) {
      await delayEmit();
      const isFCMReady = await invokeFCMIsReady(channel);
      const payload = data as { address: string; collection: string; total: number };
      const collection = await idBufferToCollection(
        channel,
        Buffer.from(payload.collection, 'hex'),
      );
      if (!collection) throw new Error('undefined Collection id while subscribing newRaffled');
      const message = {
        collection: { id: collection.id, name: collection.name },
        total: payload.total,
      };
      if (isFCMReady) {
        try {
          await sendDataOnlyTopicMessaging(channel, payload.address, 'newRaffled', message);
        } catch (err) {
          io.to(getSocketIdByAddress(payload.address)).emit(`newRaffled`, message);
        }
      } else {
        io.to(getSocketIdByAddress(payload.address)).emit(`newRaffled`, message);
      }
    }
  });
}

export function onWonRaffle(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('redeemableNft:wonRaffle', async data => {
    if (data) {
      await delayEmit();
      const isFCMReady = await invokeFCMIsReady(channel);
      const payload = data as { address: string; collection: string; items: string[] };
      const collection = await idBufferToCollection(
        channel,
        Buffer.from(payload.collection, 'hex'),
      );
      if (!collection) throw new Error('undefined Collection id while subscribing wonRaffle');
      const message = {
        collection: { id: collection.id, name: collection.name },
        total: payload.items.length,
      };
      if (isFCMReady) {
        try {
          await sendDataOnlyTopicMessaging(channel, payload.address, 'wonRaffle', message);
        } catch (err) {
          io.to(getSocketIdByAddress(payload.address)).emit(`wonRaffle`, message);
        }
      } else {
        io.to(getSocketIdByAddress(payload.address)).emit(`wonRaffle`, message);
      }
    }
  });
}
