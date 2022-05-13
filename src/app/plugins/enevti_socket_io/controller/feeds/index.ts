import { BaseChannel } from 'lisk-framework';
import { Server } from 'socket.io';

export function onNewFeedItem(channel: BaseChannel, io: Server) {
  channel.subscribe('redeemableNft:newCollection', () => {
    io.emit(`newFeedItem`, Date.now());
  });
}
