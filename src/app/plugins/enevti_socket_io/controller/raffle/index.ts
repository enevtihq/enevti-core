import { BaseChannel } from 'lisk-framework';
import { Server, Socket } from 'socket.io';
import { NewBlockRecordEvent } from 'enevti-types/param/social_raffle';
import { Collection } from 'enevti-types/chain/collection';
import { sendDataOnlyTopicMessaging } from '../../utils/pushNotification';
import idBufferToCollection from '../../../enevti_http_api/utils/transformer/idBufferToCollection';
import { getSocketIdByAddress } from '../../utils/mapper';
import { invokeFCMIsReady } from '../../../firebase_cloud_messaging/utils/invoker';
import { delayEmit } from '../../utils/delayEmit';
import { invokeGetRaffleBlockRecord } from '../../../enevti_http_api/utils/invoker/social_raffle';

export function onNewRaffleBlockRecord(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('socialRaffle:newBlockRecord', async data => {
    if (data) {
      const payload = data as NewBlockRecordEvent;
      const raffleBlockRecord = await invokeGetRaffleBlockRecord(channel, payload.height);

      if (raffleBlockRecord.items.length > 0) {
        const raffledCollection = new Set<string>();

        for (const items of raffleBlockRecord.items) {
          const collection = await idBufferToCollection(channel, items.id);
          if (!collection) throw new Error('undefined Collection id while subscribing newRaffled');

          await handleOnWonRaffle(
            channel,
            io,
            items.winner.toString('hex'),
            collection,
            items.raffled.map(t => t.toString('hex')),
          );

          if (!raffledCollection.has(collection.id)) {
            raffledCollection.add(collection.id);
            await handleOnNewRaffled(channel, io, collection, items.raffled.length);
          }
        }
      }
    }
  });
}

async function handleOnNewRaffled(
  channel: BaseChannel,
  io: Server | Socket,
  collection: Collection,
  total: number,
) {
  await delayEmit();
  const isFCMReady = await invokeFCMIsReady(channel);
  const message = {
    collection: { id: collection.id, name: collection.name },
    total,
  };
  if (isFCMReady) {
    try {
      await sendDataOnlyTopicMessaging(channel, collection.creator.address, 'newRaffled', message);
    } catch (err) {
      io.to(getSocketIdByAddress(collection.creator.address)).emit(`newRaffled`, message);
    }
  } else {
    io.to(getSocketIdByAddress(collection.creator.address)).emit(`newRaffled`, message);
  }
}

async function handleOnWonRaffle(
  channel: BaseChannel,
  io: Server | Socket,
  winner: string,
  collection: Collection,
  items: string[],
) {
  await delayEmit();
  const isFCMReady = await invokeFCMIsReady(channel);
  const message = {
    collection: { id: collection.id, name: collection.name },
    total: items.length,
  };
  if (isFCMReady) {
    try {
      await sendDataOnlyTopicMessaging(channel, winner, 'wonRaffle', message);
    } catch (err) {
      io.to(getSocketIdByAddress(winner)).emit(`wonRaffle`, message);
    }
  } else {
    io.to(getSocketIdByAddress(winner)).emit(`wonRaffle`, message);
  }
}
