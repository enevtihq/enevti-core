import { BaseChannel } from 'lisk-framework';
import { Server } from 'socket.io';

export function onNewFeedItem(channel: BaseChannel, io: Server) {
  channel.subscribe('redeemableNft:newCollection', data => {
    if (data) {
      io.emit(`newFeedItem`, Date.now());
    }
  });
}
