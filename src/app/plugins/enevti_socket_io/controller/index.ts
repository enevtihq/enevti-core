import { BaseChannel } from 'lisk-framework';
import { Server } from 'socket.io';
import { onNewActivityCollection, onNewActivityNFT } from './activity';
import { onNewNFTMinted } from './collection';
import { onNewFeedItem } from './feeds';
import {
  onBalanceChanged,
  onNewCollectionByAddress,
  onNewPendingByAddress,
  onPendingUtilityDelivery,
  onSecretDelivered,
  onTotalNFTSoldChanged,
  onTotalStakeChanged,
  onUsernameUpdated,
} from './profile';
import { onStakerUpdates } from './stake';

export function createEnevtiSocket(channel: BaseChannel, io: Server) {
  // Profile Socket
  onUsernameUpdated(channel, io);
  onBalanceChanged(channel, io);
  onTotalStakeChanged(channel, io);
  onNewCollectionByAddress(channel, io);
  onNewPendingByAddress(channel, io);
  onPendingUtilityDelivery(channel, io);
  onTotalNFTSoldChanged(channel, io);
  onSecretDelivered(channel, io);

  // Stake Socket
  onStakerUpdates(channel, io);

  // Feed Socket
  onNewFeedItem(channel, io);

  // Collection Socket
  onNewNFTMinted(channel, io);

  // Activity Socket
  onNewActivityCollection(channel, io);
  onNewActivityNFT(channel, io);
}

export function registerAccountSocket(io: Server) {
  io.on('connection', socket => {
    socket.on('register', async (address: string) => {
      await socket.join(address);
    });
  });
}
