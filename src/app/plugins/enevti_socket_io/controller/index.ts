import { BaseChannel } from 'lisk-framework';
import { Server } from 'socket.io';
import { onNewFeedItem } from './feeds';
import {
  onBalanceChanged,
  onNewCollectionByAddress,
  onPendingUtilityDelivery,
  onTotalStakeChanged,
  onUsernameUpdated,
} from './profile';
import { onStakerUpdates } from './stake';

export function createEnevtiSocket(channel: BaseChannel, io: Server) {
  onUsernameUpdated(channel, io);
  onBalanceChanged(channel, io);
  onTotalStakeChanged(channel, io);
  onStakerUpdates(channel, io);
  onNewCollectionByAddress(channel, io);
  onNewFeedItem(channel, io);
  onPendingUtilityDelivery(channel, io);
}

export function registerAccountSocket(io: Server) {
  io.on('connection', socket => {
    socket.on('register', async (address: string) => {
      await socket.join(address);
    });
  });
}
