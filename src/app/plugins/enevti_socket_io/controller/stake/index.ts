import { BaseChannel } from 'lisk-framework';
import { Server, Socket } from 'socket.io';
import { delayEmit } from '../../utils/delayEmit';

export function onStakerUpdates(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('creatorFinance:stakerUpdates', async data => {
    if (data) {
      await delayEmit();
      const payload = data as { address: string };
      io.to(payload.address).emit(`stakerUpdates`, Date.now());
    }
  });
}
