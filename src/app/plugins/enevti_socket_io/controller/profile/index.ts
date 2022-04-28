import { BaseChannel } from 'lisk-framework';
import { Server } from 'socket.io';

export function onUsernameUpdated(channel: BaseChannel, io: Server) {
  channel.subscribe('persona:newUsername', data => {
    if (data) {
      const payload = data as { address: string; username: string };
      io.emit(`profile:${payload.address}`, {
        type: 'newUsername',
        target: payload.address,
        payload: payload.username,
      });
    }
  });
}
