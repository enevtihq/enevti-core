import { BaseChannel } from 'lisk-framework';
import { Server } from 'socket.io';
import { onBalanceChanged, onTotalStakeChanged, onUsernameUpdated } from './profile';
import { onStakerUpdates } from './stake';

export function createEnevtiSocket(channel: BaseChannel, io: Server) {
  onUsernameUpdated(channel, io);
  onBalanceChanged(channel, io);
  onTotalStakeChanged(channel, io);
  onStakerUpdates(channel, io);
}
