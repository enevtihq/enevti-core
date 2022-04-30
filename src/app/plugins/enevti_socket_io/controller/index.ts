import { BaseChannel } from 'lisk-framework';
import { Server } from 'socket.io';
import { onBalanceMinus, onBalancePlus, onTotalStakePlus, onUsernameUpdated } from './profile';

export function createEnevtiSocket(channel: BaseChannel, io: Server) {
  onUsernameUpdated(channel, io);
  onBalancePlus(channel, io);
  onBalanceMinus(channel, io);
  onTotalStakePlus(channel, io);
}
