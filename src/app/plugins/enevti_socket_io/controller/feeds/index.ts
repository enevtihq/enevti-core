import { BaseChannel } from 'lisk-framework';
import { Server, Socket } from 'socket.io';

export function onNewFeedItem(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('redeemableNft:newCollection', () => {
    io.emit(`newFeedItem`, Date.now());
  });
}
