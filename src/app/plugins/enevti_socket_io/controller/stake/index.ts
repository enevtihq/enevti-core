import { BaseChannel } from 'lisk-framework';
import { Server, Socket } from 'socket.io';

export function onStakerUpdates(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('creatorFinance:stakerUpdates', data => {
    if (data) {
      const payload = data as { address: string };
      io.to(payload.address).emit(`stakerUpdates`, Date.now());
    }
  });
}
