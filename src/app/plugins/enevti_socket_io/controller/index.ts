import { BaseChannel } from 'lisk-framework';
import { Server } from 'socket.io';
import { onBalanceChanged, onTotalStakeChanged, onUsernameUpdated } from './profile';

export function createEnevtiSocket(channel: BaseChannel, io: Server) {
  onUsernameUpdated(channel, io);
  onBalanceChanged(channel, io);
  onTotalStakeChanged(channel, io);
}
