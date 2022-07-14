import { BaseChannel } from 'lisk-framework';
import { Server, Socket } from 'socket.io';

export function onNewBlock(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('app:block:new', () => {
    io.to('chain').emit(`newBlock`, Date.now());
  });
}
