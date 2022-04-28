import { BaseChannel } from 'lisk-framework';
import { Server } from 'socket.io';
import { onUsernameUpdated } from './profile';

export function createEnevtiSocket(channel: BaseChannel, io: Server) {
  onUsernameUpdated(channel, io);
}
