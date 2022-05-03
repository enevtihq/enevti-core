import { BaseChannel } from 'lisk-framework';
import { Server } from 'socket.io';

export function onStakerUpdates(channel: BaseChannel, io: Server) {
  channel.subscribe('creatorFinance:stakerUpdates', data => {
    if (data) {
      const payload = data as { address: string };
      io.emit(`stake:${payload.address}`, {
        type: 'stakerUpdates',
        target: payload.address,
        payload: Date.now(),
      });
    }
  });
}
